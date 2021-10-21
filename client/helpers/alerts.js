// Alert  messages for registration

export const showSuccessMessage = (success) => {
  return <div className="alert alert-success">{success}</div>;
};
export const showErrorMessage = (error) => {
  return <div className="alert alert-danger">{error}</div>;
};
export const showErrorMessagePassword = () => {
  return <div className="alert alert-danger">Passwords do not match</div>;
};
