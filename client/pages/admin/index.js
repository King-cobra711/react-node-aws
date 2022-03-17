import Layout from "../../components/layout";
import withAdmin from "../withAdmin";
import Link from "next/link";

const Admin = ({ user, token, userLinks }) => (
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
          <li className="nav-item">
            <Link href="admin/category/read">
              <a className="nav-link">All Categories</a>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="admin/links/read">
              <a className="nav-link">All Links</a>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="admin/users/read">
              <a className="nav-link">All Users</a>
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
