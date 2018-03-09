/* eslint-env mocha-http */
/* eslint-env mocha */

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

const should = chai.should();
const { expect } = chai;

chai.use(chaiHttp);

describe('campgrounds', () => {
    it('should list all campgrounds on /campgrounds GET', (done) => {
        chai.request(server)
            .get('/campgrounds')
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res).to.be.html;
                done();
            });
    });
    // it('should list a SINGLE campground on /campgrounds/<id> GET', (done) => {
    //     chai.request(server)
    //         .get('/campgrounds/5a9ac6b519daa523e6c829ee')
    //         .end((err, res) => {
    //             expect(err).to.be.null;
    //             expect(res).to.have.status(200);
    //             expect(res).to.be.html;
    //             done();
    //         });
    // });
    it('should add a campgrounds campground on /campgrounds POST', (done) => {
        chai.request(server)
            .post('/campgrounds')
            .send({
                name: 'schillertal',
                image: 'fjdkafjadlf',
                description: 'lalala',
                price: '20',
            }).then((res) => {
                expect(res).to.have.status(200);
                expect(res).to.be.html;
                done();
            });
    });
    it('should update a SINGLE campground on /campgrounds/<id> PUT', (done) => {
        chai.request(server)
            .put('/campgrounds/5a9ac6b519daa523e6c829ee')
            .send({
                name: 'schillertal',
                image: 'fjdkafjadlf',
                description: 'lalala',
                price: '20',
            }).then((res) => {
                expect(res).to.have.status(200);
                expect(res).to.be.html;
                done();
            });
    });
    it('should delete a SINGLE campground on /campgrounds/<id> DELETE', (done) => {
        chai.request(server)
            .del('/campgrounds/5a9ac6b519daa523e6c829ee')
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res).to.be.html;
                done();
            });
    });
});

describe('comments', () => {
    // it('should list all comments on /comments GET', (done) => {
    //     chai.request(server)
    //         .get('/campgrounds/5a9ac6b519daa523e6c829ee/comments')
    //         .end((err, res) => {
    //             expect(err).to.be.null;
    //             expect(res).to.have.status(200);
    //             expect(res).to.be.html;
    //             done();
    //         });
    // });
    // it('should list a SINGLE comments on /comments/<id> GET', (done) => {
    //     chai.request(server)
    //         .get('/campgrounds/5a9ac6b519daa523e6c829ee/comments/ru39ruewoif')
    //         .end((err, res) => {
    //             expect(err).to.be.null;
    //             expect(res).to.have.status(200);
    //             expect(res).to.be.html;
    //             done();
    //         });
    // });
    it('should add a comment on /comments POST', (done) => {
        chai.request(server)
            .post('/campgrounds/5a9ac6b519daa523e6c829ee/comments')
            .send({
                name: 'schillertal',
                image: 'fjdkafjadlf',
                description: 'lalala',
                price: '20',
            }).then((res) => {
                expect(res).to.have.status(200);
                expect(res).to.be.html;
                done();
            });
    });
    it('should update a SINGLE comments on /comments/<id> PUT', (done) => {
        chai.request(server)
            .put('/campgrounds/5a9ac6b519daa523e6c829ee/comments/3rhjfklsadfdf')
            .send({
                name: 'schillertal',
                image: 'fjdkafjadlf',
                description: 'lalala',
                price: '20',
            }).then((res) => {
                expect(res).to.have.status(200);
                expect(res).to.be.html;
                done();
            });
    });
    it('should delete a SINGLE campground on /campgrounds/<id> DELETE', (done) => {
        chai.request(server)
            .del('/campgrounds/5a9ac6b519daa523e6c829ee')
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res).to.be.html;
                done();
            });
    });
});
