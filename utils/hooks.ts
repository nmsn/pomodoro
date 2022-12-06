import { atom, useSetRecoilState, AtomEffect } from "recoil";
/**
 * FIXME recoil-persist 直接用会有问题
 * https://github.com/polemius/recoil-persist/issues/65
 * https://stackoverflow.com/questions/68110629/nextjs-react-recoil-persist-values-in-local-storage-initial-page-load-in-wrong/73536131?noredirect=1#comment129857349_73536131
 */
const ssrCompletedState = atom({
  key: "SsrCompleted",
  default: false,
});

export const useSsrComplectedState = () => {
  const setSsrCompleted = useSetRecoilState(ssrCompletedState);
  return () => setSsrCompleted(true);
};

export const persistAtomEffect =
  (persistAtom: AtomEffect<any>) => (param: Parameters<AtomEffect<any>>[0]) => {
    param.getPromise(ssrCompletedState).then(() => persistAtom(param));
  };
