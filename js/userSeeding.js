import User from '../app/models/User.js';
import encrypt from '../app/utils/authValidation/encrypt.js';
import logger from '../app/utils/logger.js';
import '../app/utils/env.load.js';

(async () => {
  try {
    const hashedPassword = await encrypt(process.env.USER_PWD);
    await User.create({
      firstName: 'Marco',
      lastName: 'Cubano',
      email: 'marco@gmail.com',
      password: hashedPassword,
      passwordConfirm: hashedPassword,
      riskProfile: 'Dynamique',
    });
    console.log('User created successfully');
  } catch (err) {
    logger.error(err);
  }
})();
