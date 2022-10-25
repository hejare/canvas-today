// import { InteractionManager } from "react-native";

export class TimeUtils {
  static async sleep(timeMs) {
    return new Promise((resolve) => {
      setTimeout(resolve, timeMs);
    });
  }

  static async runNextAnimationFrame(task) {
    return new Promise((resolve, reject) => {
      requestAnimationFrame(() => {
        task().then(resolve).catch(reject);
      });
    });
  }

  // static async runAfterInteractions(task) {
  //   // Wrap call in promise to avoid crashes caused by uncaught errors
  //   // in the InteractionManager class
  //   return new Promise((resolve, reject) => {
  //     InteractionManager.runAfterInteractions({
  //       name: "Asynchronous Action",
  //       gen: () => {
  //         return task().then(resolve).catch(reject);
  //       },
  //     })
  //       .then()
  //       .catch((e) => {
  //         console.error("timeUtils.runAfterInteractions error:", e);
  //       });
  //   });
  // }
}
