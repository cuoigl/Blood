import { Chip, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { MRT_ColumnDef } from 'material-react-table';
import { NavLink } from 'react-router-dom';
import {
   formatDate,
   getDistrictByCode,
   getProvinceByCode,
   getWardByCode,
   RequestStatus,
} from 'src/utils';
import { AiFillCaretLeft } from 'react-icons/ai';

const getStatus = status => {
   switch (status) {
      case RequestStatus.Pending:
         return { label: 'Đang chờ xử lí', color: 'warning' };
      case RequestStatus.Approve:
         return { label: 'Chấp thuận', color: 'success' };
      case RequestStatus.Reject:
         return { label: 'Không chấp thuận', color: 'error' };
      default:
         return null;
   }
};

export const allColumns: Array<MRT_ColumnDef<any>> = [
   {
      accessorKey: 'hospitals.nameHospital',
      header: 'Hospital',
      size: 150,
      Cell: ({ row }) => {
         const data = row.original;
         const name = data.hospitals?.nameHospital;

         return (
            <NavLink to={`/manage/hospitals/${data?.hospitalid}`} className={''}>
               {name}
            </NavLink>
         );
      },
   },
   {
      accessorKey: 'requestDate',
      header: 'Date Take',
      size: 60,
      Cell: ({ row }) => {
         const requestDate = row.original?.datetake;

         return <Typography fontSize={14}>{formatDate(requestDate)}</Typography>;
      },
   },
   {
      accessorKey: 'address',
      header: 'Blood Type',
      size: 200,
      Cell: ({ row }) => {
         const quantityTakes = row?.original?.quantityTake;
     
         if (!quantityTakes || quantityTakes.length === 0) {
           return <Typography fontSize={14}>No Blood Type Available</Typography>;
         }
     
         // Extract and format blood types with their quantities
         const bloodTypeQuantities = quantityTakes.map(item => {
           const bloodType = item?.bloodtypes?.nameBlood;
           const quantity = item?.quantity;
           return bloodType && quantity ? `${bloodType} số lượng: ${quantity}` : null;
         }).filter(Boolean).join(', ');
     
         return <Typography fontSize={14}>{bloodTypeQuantities}</Typography>;
       },
    }    
    ,
   {
      accessorKey: 'status',
      header: 'Status',
      size: 200,
      Cell: ({ row }) => {
         const data = row.original?.status;
         return (
            <Chip
               label={getStatus(data)?.label || '--'}
               color={getStatus(data)?.color as 'success' | 'error' | 'warning'}
            />
         );
      },
   },
];
