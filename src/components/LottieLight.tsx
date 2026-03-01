import lottieLight from "lottie-web/build/player/lottie_light";

import { LottieVersion } from "../types";

import { lottieHoc } from "./LottieHoc";

/**
 * Lottie's light animation component
 */
export const LottieLight = lottieHoc<typeof LottieVersion.light>(lottieLight);
