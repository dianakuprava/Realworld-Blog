import { Children } from 'react';
import Header from '@components/Header/Header.jsx';

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main>{Children.only(children)}</main>
    </>
  );
}
