## IT Learning Resources

[Visit IT Learning Resources!](http://ec2-3-25-137-212.ap-southeast-2.compute.amazonaws.com/)

IT Learning Resources is an app where multiple users can login and post/manage contents they submit. The content is related to IT categories such as JavaScript and PHP and users will be able to post links to useful resources relating to these categories. Users can show wether the links they submit are video/article and if they are free/paid resources. This app has full CRUD functionality allowing users to also update and delete links they have submitted.The categories are controlled by administrative users, these users can add or remove categories as well as any links that have been submitted from other users if necessary.

The links that are submitted by users will show the categories they are related to, if the link is free/paid, if the link is video/article, who submitted the link, when they submitted the link and also how many veiws or clicks that particular link has. There is a 'most popular' section on each category page that shows the top 3 links with the most clicks for that category and on the home page there is a 'trending' section that shows the top 3 most clicked links for the entire site.

The registration process utilises AWS SES (Simple Email Service) to verify users email on registration by sending an email with a URL and JWT that directs users to a confirmation page so that they may confirm their email and save their information into the MongoDB database. If users forget their password, SES is also used as part of the reset password process. AWS EC2 (Elastic Compute Cloud) is used for hosting the backend NodeJS API and React/Next JS frontend, all within one instance. Images for categories are uploaded and stored using AWS S3 (Simple Storage Service).

## Tech stack

- React and NextJS (React Framework) in the client side.
- API/server using Node Express MongoDB.
- AWS services such as S3 for files storage, SES for sending emails and EC2 for cloud hosting IAM for Identity and access management Route 53 for domain management along with custom rules/policy.
- Mongo Atlas as Managed Database Service in the cloud.

## Resources

- [Mern React Node](https://www.udemy.com/course/mern-react-node-aws/)
- [MongoDB](https://www.mongodb.com/)
- [Next js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Node](https://nodejs.org/en/)
- [AWS](https://aws.amazon.com/)
