// import path from 'path';
// import fs from 'fs/promises';
import createHttpError from 'http-errors';
// import { UsersCollection } from '../db/models/user.js';
import { getUserById } from '../services/user.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { env } from '../utils/env.js';
import { updateUser } from '../services/user.js';

// export const getAllInfoContact = async (req, res) => {
//     const{sortBy, sortOrder}=
// }
// export const getAllInfoUser = async(res);
export const getUserByIdController = async (req, res) => {
  const { id } = req.params;
  //   const userId = req.user._id;
  const user = await getUserById(id);
  if (!user) {
    return res.status(404).json({
      status: 404,
      message: 'User not found',
      data: { message: 'User not found' },
    });
  }
  res.status(200).json({
    status: 200,
    message: `Successfully found user with id ${id}!`,
    data: user,
  });
};

// update User
export const updateUserController = async (req, res) => {
  const { id } = req.params;
  const avatar = req.file;
  let avatarUrl;
  if (avatar) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      avatarUrl = await saveFileToCloudinary(avatar,'avatar');
    } else {
      avatarUrl = await saveFileToUploadDir(avatar);
    }
  }
  const data = await updateUser(id, {
    ...req.body,
    avatar: avatarUrl,
  });
  if (!data) {
    throw createHttpError(404, 'There is no such user, unfortunately');
  }
  res.status(200).json({
    status: 200,
    message: 'Successful user change',
    data: data.user,
  });
};
