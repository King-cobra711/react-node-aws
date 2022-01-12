import Layout from "../../components/layout";
import withAdmin from "../withAdmin";

const Admin = ({ user, token }) => (
  <Layout>
    {JSON.stringify(user)}
    {JSON.stringify(token)}
  </Layout>
);

export default withAdmin(Admin);
