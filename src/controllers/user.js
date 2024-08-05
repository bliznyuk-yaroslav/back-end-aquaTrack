import createHttpError from 'http-errors';
import { getUserById } from '../services/user.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { env } from '../utils/env.js';
import { updateAvatar } from '../services/user.js';
import { updateUser } from '../services/user.js';
export const getUserByIdController = async (req, res) => {
  const { _id: userId } = req.user;
  const user = await getUserById(userId);
  if (!user) {
    return res.status(404).json({
      status: 404,
      message: 'User not found',
      data: { message: 'User not found' },
    });
  }
  res.status(200).json({
    status: 200,
    message: `Successfully found user with!`,
    data: user,
  });
};

// update User
export const updateUserController = async (req, res) => {
  const { _id: userId } = req.user;
  if (req.body.email) {
    return res.status(400).json({
      status: 400,
      message: 'Email cannot be changed',
    });
  }

  const data = await updateUser(userId, req.body);
  if (!data) {
    throw createHttpError(404, 'There is no such user, unfortunately');
  }
  res.status(200).json({
    status: 200,
    message: 'Successful user change',
    data: data.user,
  });
};
export const updateAvatarController = async (req, res) => {
  const { _id: userId } = req.user;
  const avatar = req.file;
  let avatarUrl;
  if (avatar) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      avatarUrl = await saveFileToCloudinary(avatar, 'avatar');
    } else {
      avatarUrl = await saveFileToUploadDir(avatar);
    }
  }

  const data = await updateAvatar(userId, {
    avatar: avatarUrl,
  });
  if (!data) {
    throw createHttpError(404, 'There is no such user, unfortunately');
  }
  res.status(200).json({
    status: 200,
    message: 'Avatar successfully added',
    data: data.user,
  });
};
