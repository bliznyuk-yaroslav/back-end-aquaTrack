import createHttpError from 'http-errors';
import { getUserById } from '../services/user.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { env } from '../utils/env.js';
import { updateAvatar } from '../services/user.js';
import { updateUser } from '../services/user.js';
import { countUser } from '../services/user.js';
const filterUserFields = (user) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    gender: user.gender,
    weight: user.weight,
    activityTime: user.activityTime,
    dailyNorma: user.dailyNorma,
    avatar: user.avatar,
  };
};
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
  const userFilter = filterUserFields(user);
  res.status(200).json({
    status: 200,
    message: `Successfully found user with!`,
    data: userFilter,
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
  const userFilter = filterUserFields(data.user);
  res.status(200).json({
    status: 200,
    message: 'Successful user change',
    data: userFilter,
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
  const userFilter = filterUserFields(data.user);
  res.status(200).json({
    status: 200,
    message: 'Avatar successfully added',
    data: userFilter,
  });
};

export const countUserController = async (req, res, next) => {
  try {
    const count = await countUser();
    res.json({ totalUsers: count });
  } catch (error) {
    next(error);
  }
};
