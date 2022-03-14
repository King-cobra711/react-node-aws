import React from "react";
import Layout from "../../components/layout";
import withUser from "../withUser";
import axios from "axios";
import { API } from "../../config";
import { getCookie } from "../../helpers/auth";

const User = ({ user, token }) => {
  return (
    <Layout>
      {JSON.stringify(user)}
      {JSON.stringify(token)}
    </Layout>
  );
};

export default withUser(User);
