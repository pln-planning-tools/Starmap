import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import useSharedHook from '../lib/client/createSharedHook';

const [useWeekTicks, setWeekTicks] = useSharedHook(useState, 2)
// function useWeekTicks(defaultValue?: number): [number, Dispatch<SetStateAction<number>>] {
//   const [numWeeks, setWeekTicks] = useState(2);
//   // const [state, setState] = useState({
//   //   value: defaultValue,
//   //   error: null,
//   //   isPending: true
//   // });
//   useEffect(() => {
//     console.log('useWeekTicks numWeeks', numWeeks)
//   }, [numWeeks]);


//   // const { value, error, isPending } = state;
//   return [numWeeks, setNumWeeks];
// }

export { useWeekTicks, setWeekTicks };
