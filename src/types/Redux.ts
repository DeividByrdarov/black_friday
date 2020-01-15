import rootReducer from "../redux/reducers"

export type MapThunkTypes<T extends { [key: string]: (...args: any[]) => any }> = {
  [K in keyof T]: (...args: Parameters<T[K]>) => ReturnType<ReturnType<T[K]>>
}

export type AppState = ReturnType<typeof rootReducer>
