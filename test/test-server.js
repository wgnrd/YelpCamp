/* eslint-env mocha-http */
/* eslint-env mocha */

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

const { expect } = chai;

chai.use(chaiHttp);

describe('campgrounds', () => {
    it('should list all campgrounds on /campgrounds GET', (done) => {
        chai.request(server)
            .get('/campgrounds')
            .end((err, res) => {
                console.log(res.header);
                expect(res.type).to.equal('text/html');
                expect(err).to.equal(null);
                expect(res).to.have.status(200);
                done();
            });
    });
});
