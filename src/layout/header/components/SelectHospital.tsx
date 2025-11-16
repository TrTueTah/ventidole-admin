// import { getListHospitalUserOptionsAPI } from '@/apis/hospital.api';
// import { ICONS } from '@/config/icons';
// import { RoleAccount } from '@/enums/tabs-employee.enum';
// import { AccountState, useAccountStore } from '@/store/account.store';
// import { HospitalState, useHospitalStore } from '@/store/hospital.store';
// import { useQuery } from '@tanstack/react-query';
// import { Select } from 'antd';
// import clsx from 'clsx';
// import { Fragment, useEffect } from 'react';

// export default function SelectHospital() {
//   const { accountInfo } = useAccountStore() as AccountState;
//   const { currentHospital, setCurrentHospital } = useHospitalStore() as HospitalState;

//   const isManageMultipleHospital = accountInfo?.role === RoleAccount.MASTER || accountInfo?.role === RoleAccount.HEAD_OFFICE;

//   const { data: hospitalOptions, isFetching } = useQuery({
//     queryKey: ['SELECT_HOSPITAL', accountInfo?.role],
//     queryFn: () => getListHospitalUserOptionsAPI(),
//     select: (response) => response.data,
//   });

//   useEffect(() => {
//     if (accountInfo && hospitalOptions?.length) {
//       if (isManageMultipleHospital) {
//         if (currentHospital) {
//           setCurrentHospital({
//             id: currentHospital?.id,
//             name: currentHospital?.name,
//             totalClinic: currentHospital.totalClinic,
//             program: currentHospital.program,
//             xcoordinate: Number(currentHospital.xcoordinate),
//             ycoordinate: Number(currentHospital.ycoordinate),
//           });
//         } else {
//           setCurrentHospital({
//             id: +hospitalOptions![0]?.id,
//             name: hospitalOptions![0]?.name,
//             totalClinic: hospitalOptions![0]?.numOfClinics,
//             program: hospitalOptions![0]?.program,
//             xcoordinate: Number(hospitalOptions![0]?.xcoordinate),
//             ycoordinate: Number(hospitalOptions![0]?.ycoordinate),
//           });
//         }
//       } else {
//         setCurrentHospital({
//           id: accountInfo.hospitalId!,
//           name: hospitalOptions?.find((hospital) => hospital.id === accountInfo.hospitalId)?.name || '',
//           totalClinic: hospitalOptions?.find((hospital) => hospital.id === accountInfo.hospitalId)?.numOfClinics || 0,
//           program: hospitalOptions?.find((hospital) => hospital.id === accountInfo.hospitalId)?.program || '',
//           xcoordinate: Number(hospitalOptions?.find((hospital) => hospital.id === accountInfo.hospitalId)?.xcoordinate),
//           ycoordinate: Number(hospitalOptions?.find((hospital) => hospital.id === accountInfo.hospitalId)?.ycoordinate),
//         });
//       }
//     }
//   }, [accountInfo, hospitalOptions]);

//   return isManageMultipleHospital && hospitalOptions ? (
//     <Fragment>
//       <Select
//         variant='outlined'
//         options={hospitalOptions.map((hospital) => ({ label: hospital.name, value: hospital.id }))}
//         suffixIcon={<img src={ICONS.CaretDown} alt='caretDown' />}
//         value={currentHospital?.id}
//         className={clsx(
//           'select-hospital font-medium text-ventidole-neutral-90',
//           (accountInfo.role === RoleAccount.LEDGER || accountInfo.role === RoleAccount.GENERAL_MANAGER) && 'hidden',
//           !hospitalOptions?.length && 'hidden',
//         )}
//         loading={isFetching}
//         onChange={(value) => {
//           const hospital = hospitalOptions.find((h) => h.id === value);
//           if (!hospital) return;
//           setCurrentHospital({
//             id: hospital.id,
//             name: hospital.name,
//             totalClinic: hospital.numOfClinics,
//             program: hospital.program,
//             xcoordinate: Number(hospital.xcoordinate),
//             ycoordinate: Number(hospital.ycoordinate),
//           });
//         }}
//         dropdownRender={(menu) => (
//           <div onWheel={(e) => e.stopPropagation()} onTouchMove={(e) => e.stopPropagation()}>
//             {menu}
//           </div>
//         )}
//       />
//     </Fragment>
//   ) : (
//     <div className='px-1 my-auto text-base font-medium text-ventidole-neutral-100'>{currentHospital?.name}</div>
//   );
// }
