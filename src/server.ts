import App from '@/app';
import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';

import validateEnv from '@utils/validateEnv';
import UserRoute from '@routes/user.route';
import BugAControlRoute from '@routes/controlapi.route';
import StatusRoute from '@routes/status.route';

validateEnv();

const app = new App([new IndexRoute(), new AuthRoute(), new UserRoute(), new BugAControlRoute(), new StatusRoute()]);

app.listen();
