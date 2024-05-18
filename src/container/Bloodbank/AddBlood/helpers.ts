import { QuantitySend } from "../../../utils/types";

import * as yup from "yup";

export const schema = yup.object({});

export interface AddBloodForm {
  hospitalid: number;
  bloodtypeid: number;
  QuantitySend: [numberbloodid: number, quantity: string];
}
