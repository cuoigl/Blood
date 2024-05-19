import { yupResolver } from "@hookform/resolvers/yup";
import { Autocomplete, Grid, MenuItem, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { AddBloodForm, schema } from "./helpers";
import { getAllProvinces, http, url_img } from "src/utils";
import Button from "src/components/Button";
import { toast } from "react-toastify";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import dayjs, { Dayjs } from "dayjs";
import { useParams } from "react-router-dom";
import LoadingCommon from "src/components/LoadingCircle";
import bloodtypeid from "./bloodtype";
import { format } from "date-fns";

const AddBlood: React.FC = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [listDistricts, setListDistricts] = useState([]);
  const [listWards, setListWards] = useState([]);
  const [quantity250, setQuantity250] = useState("0");
  const [quantity350, setQuantity350] = useState("0");
  const [quantity450, setQuantity450] = useState("0");
  const [bloodtypes, setBloodtypes] = useState("");

  const { id } = useParams<{ id: string }>();

  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddBloodForm>({
    resolver: yupResolver<any>(schema),
    mode: "onChange",
    defaultValues: {},
  });

  useEffect(() => {
    if (!!id) {
      setIsLoading(true);
      http
        .get(`Hopital/getRequestbyid?id=${id}`)
        .then((res) => {
          const data = res?.data?.data;
          reset({});
        })
        .catch((err) => {
          setIsLoading(false);
          console.error("err", err);
        });
    }
  }, [id, reset]);
  const onSubmit = (value) => {
    setIsAdding(true);
    const now = new Date();
    const formattedNow = format(now, "yyyy/MM/dd");
    const hospitalId = JSON.parse(localStorage.getItem("currentUser"))?.userId;
    const payload = {
      hospitalid: hospitalId,
      datesend: formattedNow,
      bloodtypeid: bloodtypes,
      quantitySend: [],
    };
    if (parseInt(quantity250) > 0) {
      payload.quantitySend.push({
        numberbloodid: 1,
        quantity: parseInt(quantity250),
      });
    }

    if (parseInt(quantity350) > 0) {
      payload.quantitySend.push({
        numberbloodid: 2,
        quantity: parseInt(quantity350),
      });
    }

    if (parseInt(quantity450) > 0) {
      payload.quantitySend.push({
        numberbloodid: 3,
        quantity: parseInt(quantity450),
      });
    }

    http
      .post("Hopital/addsendblood", payload)
      .then((res) => {
        toast.success("success");
        setIsAdding(false);
      })
      .catch((err) => {
        setIsAdding(false);
        console.error("err", err);
      });
  };

  return isLoading ? (
    <LoadingCommon additionalClass="h-[100vh]" />
  ) : (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="w-full px-8 pt-6">
        <h2>Thêm máu</h2>
        <div className="w-full pt-4">
          <form className="max-w-[600px]" onSubmit={handleSubmit(onSubmit)}>
            <Grid xs={12}>
              <Grid xs={10} mb={2} gap={1}>
                <TextField
                  select
                  label="Nhóm máu"
                  fullWidth
                  value={bloodtypes}
                  onChange={(e) => setBloodtypes(e.target.value)}
                >
                  <MenuItem value={2}>A</MenuItem>
                  <MenuItem value={3}>B</MenuItem>
                  <MenuItem value={4}>AB</MenuItem>
                  <MenuItem value={5}>O</MenuItem>
                </TextField>
                {bloodtypes === "" && (
                <p className="text-sm text-red-500 color-red">
                  Vui lòng chọn nhóm máu
                </p>
              )}
              </Grid>
              <Grid xs={6} mb={2} gap={1}>
                <TextField
                  label="250ML"
                  value={quantity250}
                  onChange={(e) => setQuantity250(e.target.value)}
                  type="number"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid xs={6} mb={2} gap={1}>
                <TextField
                  label="350ML"
                  value={quantity350}
                  onChange={(e) => setQuantity350(e.target.value)}
                  type="number"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid xs={6} mb={2} gap={1}>
                <TextField
                  label="450ML"
                  value={quantity450}
                  onChange={(e) => setQuantity450(e.target.value)}
                  type="number"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              {quantity250 === "0" && quantity350 === "0" && quantity450 === "0" && (
                <p className="text-sm text-red-500 color-red">
                  Bạn cần nhập ít nhất một trong ba trường số lượng
                </p>
              )}
            </Grid>
            <Button type="submit" isLoading={isAdding}>
              {!!id ? "Cập nhật" : "Tạo"}
            </Button>
          </form>
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default AddBlood;
