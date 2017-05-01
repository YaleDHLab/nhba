### Dependencies

This application requires Node.js (version 6 or higher) and MongoDB.

Data migrations within this application require pymongo (`pip install pymongo`).

### Runnning Locally

To run this application on your machine, open a terminal and run:

```
git clone https://github.com/duhaime/nhba
cd nhba
npm install --no-optional
npm run seed
npm run production
```

### Deploying to EC2

To deploy this app on an Amazon Linux instance on EC2, one must:
 - [ ] install the application dependencies
 - [ ] obtain ssl certificates
 - [ ] configure the app for https
 - [ ] store required environment variables
 - [ ] and then start the application

#### Install Dependencies

```
# Install Node.js on Amazon Linux
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install 6.10.0
node -v
```

```
# Install MongoDB on Amazon Linux
sudo touch /etc/yum.repos.d/mongodb-org-3.4.repo
sudo vim /etc/yum.repos.d/mongodb-org-3.4.repo

# paste the following:
[mongodb-org-3.4]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/amazon/2013.03/mongodb-org/3.4/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-3.4.asc

sudo yum install -y mongodb-org
sudo service mongod start
sudo chkconfig mongod on
```

#### Obtain SSL Certificates

Let's Encrypt allows users to obtain free SSL certificates for bound domain addresses. To run the Let's Encrypt client and obtain certificates, you must create an Elastic IP for your EC2 instance, obtain a domain name (e.g. Cats.com) and bind your EC2 instance to the domain. For users using NameCheap, [this post](http://techgenix.com/namecheap-aws-ec2-linux/) provides a thorough guide.

Once this is done, one can download and run the Let's Encrypt client with the following commands:

```
# get Let's Encrypt client
wget https://dl.eff.org/certbot-auto
chmod a+x certbot-auto

# pass domain to -d; must be a bound domain, not a raw IP
sudo ./certbot-auto --debug -v --server https://acme-v01.api.letsencrypt.org/directory certonly -d YOURDOMAIN.EXT
```

Here YOURDOMAIN.EXT refers to the domain to which your instance is bound. When prompted, select the second option (temporary server) to process your certificates.

Then update `nhba/config.js` file to reflect the location of your certificates. The default location is `/etc/letsencrypt/live/YOURDOMAIN.EXT/fullchain.pem`

#### Move to HTTPS

To run your application on HTTPS, just update `nhba/config.js`:

```
config.api = {
  protocol: 'https',
  host: 'YOURDOMAIN.EXT',
  port: 443,
  prefix: 'api'
}
```

#### Store Environment Variables

Add the following variables to `~/.bash_profile`:
```
export NHBA_EMAIL='YOURGMAILACCOUNT'           # e.g. catparty
export NHBA_EMAIL_PASSWORD='YOURGMAILPASSWORD' # e.g. meow
export NHBA_SECRET='NHBA_SECRET'               # equivalent to `rake secret`
export NHBA_SALT_WORK_FACTOR=10                # encryption difficulty
export NHBA_ENVIRONMENT='production'           # switch to production
```
Then `source ~/.bash_profile`

#### Start Application

```
npm run compress
sudo node server.js
```

You may wish to use a wrapper like forever.js to keep your server running...
