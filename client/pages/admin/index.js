import Layout from "../../components/layout";
import withAdmin from "../withAdmin";
import Link from "next/link";

const Admin = ({ user, token }) => (
  <Layout>
    <h1>Admin Dashboard</h1>
    <div className="row">
      <div className="col-md-4">
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link href="admin/category/create">
              <a className="nav-link">Create Category</a>
            </Link>
          </li>
        </ul>
      </div>
      <div className="col-md-8"></div>
    </div>
  </Layout>
);

export default withAdmin(Admin);
// export default Admin;
