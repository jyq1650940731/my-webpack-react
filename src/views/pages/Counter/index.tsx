/*
 * @Author: YourName
 * @Date: 2024-09-24 19:44:18
 * @LastEditTime: 2024-09-25 23:21:50
 * @LastEditors: YourName
 * @Description: 
 * @FilePath: \webpack\my-webpack\src\views\pages\counter\index.tsx
 * 版权声明
 */
import React from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
// import { decrement, increment } from "@/store/features/counterSlice";
import { decrement, increment,incrementByAmount } from "@/store/features/counterSlice";

export default function Counter() {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <div>
      <div>
        <button
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          Increment
        </button>
        <span>{count}</span>
        <button
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          Decrement
        </button>
        <button
          aria-label="Decrement value"
          onClick={() => dispatch(incrementByAmount(2))}
        >
          incrementByAmount
        </button>
        
      </div>
    </div>
  );
}
