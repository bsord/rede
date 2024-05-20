
  

# Rede.io
Rede is an automated content generation service that runs on a schedule. It currently sends AI generated richly formatted emails, by gathering data from the web based on a users desired content type and interest, sending that to an LLM for generating the content with useful context, and sending the resulting HTML in an email to the user.

## Details
It's configured and deployed via Terraform + Serverless and runs on AWS.
The front end is React with Vite. 

The core Infrastructure resources such as DNS zones, buckets, databases, queues, etc. are deployed via Terraform to AWS, MongoDB Atlas, and CloudFlare.

The backend is comprised of various Javascript Serverless functions behind an AWS API Gateway. The front end is hosted on S3 and fronted by a CloudFront distribution. Emails will be sent with SendGrid

## Getting Started
To get started you will need to make sure you have the following Command line tools installed

**Prerequisites:**
- An available domain or subdomain in Cloudflare
- AWS Cli
https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html
```sh
curl  "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip"  -o  "awscliv2.zip"
unzip  awscliv2.zip
sudo  ./aws/install
```
- Terraform
  - https://developer.hashicorp.com/terraform/downloads
- Terraform Cloud account
- Serverless
  -  `npm install -g serverless`

 - AWS Access Keys:
AWS Console > User Profile > Security Credentials > Access Keys > Click `Create Access Key`
*Ideally you'd create a group in IAM, define the least privaledged permissions for the group, add user to the group, then get access tokens for said user*

## Step 1: Configure AWS cli to use credentials
- run `aws configure`

## Step 2: Deploy Terraform Infrastructure
#### 1) Configure Environment Variables
See `infrastructure/variables.tf` for all required variables

Additionally, you'll need to set AWS_SECRET_KEY, and AWS_ACCESS_KEY_ID

#### 2) Deploy Infrastructure
1)  `cd infrastructure`
2)  `terraform init`
3)  `terraform plan`
4)  `terraform apply`

CERT VALIDATION WILL SAY STILL CREATING UNTIL YOU COMPLETE STEP 3
YOU MUST POINT YOUR DNS NS SERVERS TO AWS IN ORDER FOR CERT TO COMPLETE
THIS CAN TAKE MANY MINUTES

### Validate terraform has completed (can take as long as the TTL to update name servers takes + some)
Once DNS name server records have updated and pointed to the AWS NS servers, the cert validation in terraform should complete, and proceed with deploying the rest of the infrastructure.

## Step 4: Deploy Services
1)  `cd ../services/auth`
2)  `npm install`
3) run `sls deploy`

After the entire service is deployed, you can deploy just one function you're working on much more quickly you can run `sls deploy -f login` to deploy any single function by its name

## Step 5: Deploy React Front End to S3 (fronted by cloudfront distribution)
1) run `cd ../web-ui`
2) run `npm install`
3) run `npm run deploy`

### Development:
1)  `npm start`

## Remove everything
1) `cd services/notes` and run `sls remove`
2) `cd infrastructure` and run `terraform destroy`