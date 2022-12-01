import React, { Dispatch, SetStateAction } from "react";
import assert from 'tiny-invariant'

type SetValue<T> = Dispatch<SetStateAction<T>>

export type SaveStateOptions<T> = {
   toJSON?: (T) => string,
   parseJSON?: (string) => T,
}

/**
 * Only support default values, not default value functions
 * inspiration: https://designcode.io/react-hooks-handbook-uselocalstorage-hook
 */
export function useSaveState<T>(
   key: string,
   defaultValue: T | (() => T),
   opts?: SaveStateOptions<T>,
): [T, SetValue<T>] {

   const [value, setValue] = React.useState<T>(() => {
      let currValue;
      try {
         if (typeof defaultValue === 'function') {
            defaultValue = (defaultValue as (() => T))()
         }
         const item = window.localStorage.getItem(key)
         const parseFn = opts?.parseJSON ?? JSON.parse
         currValue = parseFn(item || String(defaultValue))
      } catch {
         currValue = defaultValue
      }
      return currValue
   })

   React.useEffect(() => {
      const toJsonFn = opts?.toJSON ?? JSON.stringify
      window.localStorage.setItem(key, toJsonFn(value))
   }, [key, opts?.toJSON, value])

   return [value, setValue]
}

const SaveState = {
   useSaveState
}
export default SaveState