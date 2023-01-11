import { useRef, useEffect } from "react";

import {
  atom,
  useSetRecoilState,
  AtomEffect,
  useRecoilValueLoadable,
} from "recoil";
/**
 * FIXME recoil-persist 直接用会有问题
 * https://github.com/polemius/recoil-persist/issues/65
 * https://stackoverflow.com/questions/68110629/nextjs-react-recoil-persist-values-in-local-storage-initial-page-load-in-wrong/73536131?noredirect=1#comment129857349_73536131
 */
export const ssrCompletedState = atom({
  key: "SsrCompleted",
  default: false,
});

export const useSsrComplectedState = () => {
  const setSsrCompleted = useSetRecoilState(ssrCompletedState);
  return () => setSsrCompleted(true);
};

export const persistAtomEffect =
  <T>(persistAtom: AtomEffect<T>, callback?: (data?: any) => void) =>
  (param: Parameters<AtomEffect<T>>[0]) => {
    param.getPromise(ssrCompletedState).then(() => {
      console.log(123);
      persistAtom(param);
      callback?.(param);
    });
  };

export const usePrevious = (value: any) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

export default usePrevious;

export const useIsSsrCompletedMoment = () => {
  const { contents } = useRecoilValueLoadable(ssrCompletedState);

  const lastContents = usePrevious(contents);

  if (lastContents === false && contents === true) {
    return true;
  }

  return false;
};
