
  

# serverless-poc
This Repo demonstrates using Terraform + Serverless + React to deploy a full stack application on AWS.

The core Infrastructure resources such as DNS zones, buckets, databases, queues, etc. are deployed via Terraform.

The backend is comprised of various JavascriptServerless functions behind an AWS API Gateway. The front end is hosted on S3 and fronted by a CloudFront distribution.

## Getting Started
To get started you will need to make sure you have the following Command line tools installed

**Prerequisites:**
- An Unused domain (this will take it over completely)
- AWS Cli
https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html
```sh
curl  "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip"  -o  "awscliv2.zip"
unzip  awscliv2.zip
sudo  ./aws/install
```
- Terraform
  - https://developer.hashicorp.com/terraform/downloads
- Serverless
  -  `npm install -g serverless`

 - AWS Access Keys:
AWS Console > User Profile > Security Credentials > Access Keys > Click `Create Access Key`
*These are root access keys, ideally you'd create a group in IAM, define the least privaledged permissions for the group, add user to the group, then get access tokens for said user, instead of root account*

## Step 1: Configure AWS cli to use credentials
- run `aws configure`

## Step 2: Deploy Terraform Infrastructure
#### 1) Configure TF Vars
- Save the below as `infrastructure/terraform.tfvars` making sure to populate the values
```
primary_domain = ""
mongodb_atlas_public_key = ""
mongodb_atlas_private_key = ""
mongodb_atlas_org_id = ""
```
*These could and probably should be defined in a terraform cloud workspace or otherwise in an env variables or passed as arguments to terraform cli (another problem for another day)*

#### 2) Deploy Infrastructure
1)  `cd infrastructure`
2)  `terraform init`
3)  `terraform plan`
4)  `terraform apply`

CERT VALIDATION WILL SAY STILL CREATING UNTIL YOU COMPLETE STEP 3
YOU MUST POINT YOUR DNS NS SERVERS TO AWS IN ORDER FOR CERT TO COMPLETE
THIS CAN TAKE MANY MINUTES

## Step 3: Point domain to AWS Route 53
https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/migrate-dns-domain-in-use.html

### Get NS servers from zone and set your NS record for the domain to include those 4 name servers
- Sign in to the AWS Management Console and open the Route 53 console at https://console.aws.amazon.com/route53/.
- In the navigation pane, choose Hosted zones.
- On the Hosted zones page, choose the name for the applicable hosted zone.
- **Make note of the four names listed for Name servers in the Hosted zone details section.**

**IMPORTANT:** Set NS servers of domain in your registrar to point to AWS NS servers

### Validate terraform has completed (can take as long as the TTL to update name servers takes + some)
Once DNS name server records have updated and pointed to the AWS NS servers, the cert validation in terraform should complete, and proceed with deploying the rest of the infrastructure.

## Step 4: Deploy Notes Service
1)  `cd ../services/notes`
2)  `npm install`
3) run `sls deploy`

After the entire service is deployed, you can deploy just one function you're working on much more quickly you can run `sls deploy -f addNote` to deploy any single function by its name

## Step 5: Deploy React Front End to S3 (fronted by cloudfront distribution)
1) run `cd ../web-ui`
2) run `npm install`
3) run `npm run deploy`

### Development:
1)  `npm start`

## TODO:

- [ ] Deploy a db with terraform and use it for the notes service
- [ ] Terraform cloud workspace implementation?
- [ ] Organize terraform resources much more nicely :D
- [ ] Configure log retention on serverless functions to not be wasteful on storage
- [ ] right size memory on serverless function to reduce cost per second of runtime

## Remove everything
1) `cd services/notes` and run `sls remove`
2) `cd infrastructure` and run `terraform destroy`