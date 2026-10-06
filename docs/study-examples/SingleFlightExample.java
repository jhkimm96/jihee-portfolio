import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import java.util.function.Supplier;

public final class SingleFlightExample {
    private final Executor workers;
    private final Map<String, CompletableFuture<String>> inFlight = new HashMap<>();
    private final Map<String, String> completed = new LinkedHashMap<>(16, 0.75f, true) {
        @Override
        protected boolean removeEldestEntry(Map.Entry<String, String> eldest) {
            return size() > 1_000;
        }
    };

    public SingleFlightExample(Executor workers) {
        this.workers = workers;
    }

    public CompletableFuture<String> getOrStart(String key, Supplier<String> loadOrigin) {
        CompletableFuture<String> pending;
        synchronized (this) {
            String cached = completed.get(key);
            if (cached != null) return CompletableFuture.completedFuture(cached);

            CompletableFuture<String> existing = inFlight.get(key);
            if (existing != null) return existing;

            pending = new CompletableFuture<>();
            inFlight.put(key, pending);
        }

        // 원본 호출 중에도 다른 키가 등록될 수 있도록 보호 구간 밖에서 시작한다.
        try {
            workers.execute(() -> loadAndShare(key, pending, loadOrigin));
        } catch (RuntimeException rejected) {
            removeInFlight(key, pending);
            pending.completeExceptionally(rejected);
        }
        return pending;
    }

    private void loadAndShare(String key, CompletableFuture<String> pending, Supplier<String> loadOrigin) {
        try {
            String value = loadOrigin.get();
            synchronized (this) {
                if (value != null) completed.put(key, value);
                inFlight.remove(key, pending);
            }
            pending.complete(value);
        } catch (Throwable failure) {
            removeInFlight(key, pending);
            pending.completeExceptionally(failure);
            if (failure instanceof Error fatal) throw fatal;
        }
    }

    private synchronized void removeInFlight(String key, CompletableFuture<String> pending) {
        inFlight.remove(key, pending);
    }
}
