import React from "react";
import Layout from "../../components/layout";
import withUser from "../withUser";

const User = ({ user, token }) => {
  return (
    <Layout>
      {JSON.stringify(user)}
      {JSON.stringify(token)}
    </Layout>
  );
};

export default withUser(User);
