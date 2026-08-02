export type SceneParams = {
    ballCount: number;
    lightAngle: number;
    cameraYaw: number;
    cameraPitch: number;
    seed: number;
};

export const DEFAULT_PARAMS: SceneParams = {
    ballCount: 12,
    lightAngle: 55,
    cameraYaw: 15,
    cameraPitch: 9,
    seed: 1,
};