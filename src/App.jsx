import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import SignIn from '@components/SignIn/SignIn.jsx';
import SignUp from '@components/SignUp/SignUp.jsx';
import EditProfile from '@components/EditProfile/EditProfile.jsx';
import ArticleList from '@components/ArticleList/ArticleList.jsx';
import Article from '@components/Article/Article.jsx';
import CreateArticle from '@components/ArticleForm/CreateArticle/CreateArticle.jsx';
import EditArticle from '@components/ArticleForm/EditArticle/EditArticle.jsx';
import AuthSession from '@/Api/AuthSession.jsx';
import PrivateRoute from '@components/PrivateRoute/PrivateRoute.jsx';

function App() {
  return (
    <Router>
      <AuthSession>
        <Layout>
          <Switch>
            <Route exact path="/" component={ArticleList} />
            <Route path="/sign-in" component={SignIn} />
            <Route path="/sign-up" component={SignUp} />
            <Route path="/profile" component={EditProfile} />
            <PrivateRoute path="/new-article">
              <CreateArticle />
            </PrivateRoute>
            <PrivateRoute path="/articles/:slug/edit">
              <EditArticle />
            </PrivateRoute>
            <Route path="/articles/:slug" component={Article} />
            <Route path="*" component={() => <div>404 Not Found</div>} />
          </Switch>
        </Layout>
      </AuthSession>
    </Router>
  );
}

export default App;
