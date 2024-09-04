# Note: This repository has been archived
This project was developed under a previous phase of the Yale Digital Humanities Lab. Now a part of Yale Library’s Computational Methods and Data department, the Lab no longer includes this project in its scope of work. As such, it will receive no further updates. The current version of this website, not reflected here, is owned by Professor Elihu Rubin.

# New Haven Building Archive

> Mapping New Haven's architectural history.

The New Haven Building Archive (NHBA) is a digital archive of the buildings in New Haven. This repository houses the site's source code and guides for building the site locally or on EC2 instances.

![App preview](/build/assets/images/nhba-landing-page.png?raw=true)

## Dependencies

This application requires Node.js (version 6 or higher) and MongoDB.

Data migrations within this application require pymongo (`pip install pymongo`).

## Quickstart

To run this application on your machine, open a terminal and run:

```
# obtain application source and enter repository
git clone https://github.com/duhaime/nhba
cd nhba

# load database
wget https://s3-us-west-2.amazonaws.com/lab-apps/nhba/archives/nhba-11-12-08.archive -O nhba.archive
mongo nhba --eval "db.dropDatabase()"
mongorestore --db nhba --archive=nhba.archive

# obtain images
wget https://s3-us-west-2.amazonaws.com/lab-apps/nhba/archives/build.tar.gz -O build.tar.gz
tar -zxf build.tar.gz

# install nvm, e.g. with brew
brew install nvm

# install node compatible with this library
nvm install v10.24.1
nvm use v10.24.1

# install dependencies
npm install --no-optional

# start production server
npm run production
```

The application will then be available on `localhost:8080`.

You can optionally open another terminal window, cd into the nhba directory, and run `npm run start` to start a development server on 8081. This development server depends on the production server, but features hot module reloading for quicker development speed.

## Deploying to EC2

To deploy this app on an Amazon Linux instance on EC2, one must:

* [ ] install the application dependencies
* [ ] obtain ssl certificates
* [ ] configure the app for https
* [ ] store required environment variables
* [ ] create file upload directory
* [ ] provision superadmin users
* [ ] and then start the application

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
export NHBA_ADMIN_EMAILS='so@gm.com go@gm.com' # space separated emails
export NHBA_SUPERADMIN_EMAILS='so@gm.com'      # space separated emails
```

Then `source ~/.bash_profile`

#### Create file upload directory

Create a directory in which user uploads can be kept:
mkdir build/assets/uploads/files

#### Provision superadmin users

Only superadmin users can appoint other admin users. Superadmin users must be appointed at the command line level:

```
# enter nhba db
mongo nhba

# find a user by their email address and make them a superadmin
db.users.update({'email': 'email@email.com'}, {$set: {'superadmin': true}})
```

#### Start Application

```
npm run compress
sudo node server.js
```

You may wish to use a wrapper like forever.js to keep your server running...
