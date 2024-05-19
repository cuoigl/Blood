import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import { BloodTotalDTO, getCurrentUser, getFullAddress } from "src/utils";

export default function RequestBloodForm({
  data,
  open,
  setOpen,
  setQuantityTake,
  onRequestBlood,
  quantityTake,
}: any) {
  const currentHospital = getCurrentUser();

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeBlood = (value: BloodTotalDTO, selectedQuantity: number, index: number) => {
    const updatedQuantityTake = [...quantityTake];
      updatedQuantityTake.push({
        numberbloodid: value.numberbloodid,
        quantity: selectedQuantity, // Sử dụng giá trị được chọn từ menu Select
      });
  
    setQuantityTake(updatedQuantityTake);
  };

  return (
    <React.Fragment>
      <Dialog maxWidth="lg" open={open} onClose={handleClose}>
        <DialogTitle className="my-1">Đơn yêu cầu lấy máu:</DialogTitle>

        <Box className="mx-3 px-3">
          <Typography variant="body1" className="my-1">
            <strong>Tên bệnh viện:</strong>{" "}
            {currentHospital?.hospitals?.nameHospital}
          </Typography>
          <Typography variant="body2" className="my-1">
            <strong>Địa chỉ:</strong> {getFullAddress()}
          </Typography>
          <Typography variant="h6" className="mt-2">
            Chọn số lượng của mỗi bình tương ứng dung tích bình máu:
          </Typography>
        </Box>

        {data?.map((item, index) => {
          return (
            <DialogContent key={index}>
              <Box noValidate component="form">
                <FormControl sx={{ minWidth: 450 }}>
                  <InputLabel htmlFor="max-width">
                    Số lượng lấy với bình {item?.quantity} ml:
                  </InputLabel>
                  <Select
                    autoFocus
                    onChange={(event) => handleChangeBlood(item, parseInt((event.target as HTMLSelectElement).value), index)}
                  >
                    {Array.from({ length: item?.total ?? 0 }, (_, subIndex) => (
                      <MenuItem
                        key={subIndex + 1}
                        value={subIndex + 1}
                      >
                        {subIndex + 1}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </DialogContent>
          );
        })}

        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button onClick={onRequestBlood}>Gửi</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
