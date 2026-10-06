import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

public class SingleFlightExampleTest {
    static void check(boolean condition, String message) {
        if (!condition) throw new AssertionError(message);
    }

    static void await(CountDownLatch signal) {
        try {
            check(signal.await(5, TimeUnit.SECONDS), "signal timed out");
        } catch (InterruptedException failure) {
            Thread.currentThread().interrupt();
            throw new RuntimeException(failure);
        }
    }

    public static void main(String[] args) throws Exception {
        try (ExecutorService workers = Executors.newFixedThreadPool(4)) {
            AtomicInteger baselineCalls = new AtomicInteger();
            CountDownLatch baselineStarted = new CountDownLatch(2);
            CountDownLatch baselineRelease = new CountDownLatch(1);
            java.util.function.Supplier<String> baselineLoader = () -> {
                baselineCalls.incrementAndGet();
                baselineStarted.countDown();
                await(baselineRelease);
                return "result";
            };
            CompletableFuture<String> first = CompletableFuture.supplyAsync(baselineLoader, workers);
            CompletableFuture<String> second = CompletableFuture.supplyAsync(baselineLoader, workers);
            try {
                await(baselineStarted);
                check(baselineCalls.get() == 2, "baseline must load twice before completion");
            } finally {
                baselineRelease.countDown();
            }
            first.get(5, TimeUnit.SECONDS);
            second.get(5, TimeUnit.SECONDS);
            System.out.println("PASS baseline: 2 overlapping loads");

            SingleFlightExample shared = new SingleFlightExample(workers);
            AtomicInteger mergedCalls = new AtomicInteger();
            CountDownLatch mergedStarted = new CountDownLatch(1);
            CountDownLatch mergedRelease = new CountDownLatch(1);
            CompletableFuture<String> representative = shared.getOrStart("same-key", () -> {
                mergedCalls.incrementAndGet();
                mergedStarted.countDown();
                await(mergedRelease);
                return "shared-result";
            });
            try {
                await(mergedStarted);
                for (int request = 1; request < 100; request++) {
                    check(shared.getOrStart("same-key", () -> "wrong-result") == representative,
                            "all overlapping requests must share one future");
                }
                check(shared.getOrStart("other-key", () -> "independent").get(5, TimeUnit.SECONDS)
                        .equals("independent"), "different key must make progress");
                try {
                    representative.get(1, TimeUnit.MILLISECONDS);
                    throw new AssertionError("caller must time out while origin is blocked");
                } catch (TimeoutException expected) {
                    check(shared.getOrStart("same-key", () -> "wrong-result") == representative,
                            "caller timeout must retain the in-flight work");
                }
            } finally {
                mergedRelease.countDown();
            }
            check(representative.get(5, TimeUnit.SECONDS).equals("shared-result"), "shared result");
            check(mergedCalls.get() == 1, "origin must be called once");
            check(shared.getOrStart("same-key", () -> "wrong-result").get(5, TimeUnit.SECONDS)
                    .equals("shared-result"), "completed cache must be reused");
            System.out.println("PASS sharing: 100 handles, 1 origin load; other key progresses");
            System.out.println("PASS caller timeout: shared work retained; late result cached");

            CompletableFuture<String> failed = shared.getOrStart("failure", () -> {
                throw new IllegalStateException("example failure");
            });
            try {
                failed.get(5, TimeUnit.SECONDS);
                throw new AssertionError("load must fail");
            } catch (ExecutionException expected) {
                check(expected.getCause() instanceof IllegalStateException, "failure is shared");
            }
            check(shared.getOrStart("failure", () -> "recovered").get(5, TimeUnit.SECONDS)
                    .equals("recovered"), "failed registration must be cleaned");
            System.out.println("PASS failure: later request can retry");

            SingleFlightExample rejected = new SingleFlightExample(task -> {
                throw new RejectedExecutionException("example rejection");
            });
            CompletableFuture<String> rejectedFirst = rejected.getOrStart("key", () -> "unused");
            check(rejectedFirst.isCompletedExceptionally(), "rejection must terminate waiters");
            check(rejected.getOrStart("key", () -> "unused") != rejectedFirst,
                    "rejection must clean the registration");
            System.out.println("PASS rejection: future failed and registration removed");
        }
    }
}
