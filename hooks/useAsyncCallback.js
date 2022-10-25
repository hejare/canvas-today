import { useCallback, useState } from "react";
import { TimeUtils } from "@/lib/timeUtils";

// interface AsyncCallbackArgs<T extends AsyncFunction> {
//   callback: (...args: Parameters<T>) => Promise<void>;
//   onSuccess?: () => void;
//   onError: (error: Error) => void;
//   onFinally?: () => void;
// }

// export function useAsyncCallback<T extends AsyncFunction>(args: AsyncCallbackArgs<T>): [(...callbackArgs: Parameters<T>) => void, boolean] {
export function useAsyncCallback(args) {
  const [isLoading, setIsLoading] = useState(false);

  const { callback, onSuccess, onError, onFinally } = args;
  const wrappedCallback = useCallback(
    (...callbackArgs) => {
      if (!isLoading) {
        setIsLoading(true);

        // Delay original callback to make UI more responsive
        TimeUtils.runNextAnimationFrame(async () => {
          // await TimeUtils.runAfterInteractions(async () => {
          await callback(...callbackArgs);
          // });
        })
          .then(() => {
            onSuccess?.();
          })
          .catch((error) => {
            onError(error);
          })
          .finally(() => {
            onFinally?.();
            setIsLoading(false);
          });
      }
    },
    [isLoading, callback, onSuccess, onError, onFinally],
  );

  return [wrappedCallback, isLoading];
}
