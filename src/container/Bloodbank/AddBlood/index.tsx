import { yupResolver } from "@hookform/resolvers/yup";
import { Autocomplete, Grid, TextField } from "@mui/material";
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

type Props = {};

interface ITypeBlood {
  bloodtypeid: number;
  nameblood: string;
}

interface INumberBlood {
  numberbloodid: number;
  quantity: string;
}

const AddBlood: React.FC<Props> = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [listDistricts, setListDistricts] = useState([]);
  const [listWards, setListWards] = useState([]);

  const { id } = useParams<{ id: string }>();

  const {
    handleSubmit,
    register,
    setValue,
    control,
    reset,
    formState: { errors },
    watch,
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
    const hospitalId = JSON.parse(localStorage.getItem("currentUser"))?.userId;

    const payload = { ...value, hospitalid: hospitalId, img: "" };

    http
      .post("Hopital/AddSendBlood", payload)
      .then((res) => {
        toast.success("success");
        setIsAdding(false);
        reset({});
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
              <Grid xs={6} mb={2} gap={1}></Grid>

              <Grid xs={10} mb={2} gap={1}>
                {/* <Controller
                  control={control}
                  name="ward"
                  render={({ field: { onChange, value, ...fields } }) => {
                    return (
                      <Autocomplete
                        disablePortal
                        options={listWards}
                        isOptionEqualToValue={({ value }, { value: _value }) =>
                          value === _value
                        }
                        renderInput={(params) => {
                          return (
                            <TextField
                              {...params}
                              variant="outlined"
                              label="Ward"
                            />
                          );
                        }}
                        {...fields}
                        onChange={(_, option) => {
                          onChange(option?.value);
                        }}
                        value={
                          watchWard
                            ? listWards.find((i) => i.value === watchWard)
                            : null
                        }
                      />
                    );
                  }}
                /> */}
              </Grid>
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
