import { Camera } from '../camera'

export type Light = Camera & {
  readonly castShadow: boolean;
}
