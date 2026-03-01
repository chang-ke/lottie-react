import lottieFull from "lottie-web";

import { LottieVersion } from "../types";

import { lottieHoc } from "./LottieHoc";

/**
 * Lottie's full animation component
 */
export const Lottie = lottieHoc<typeof LottieVersion.full>(lottieFull);
