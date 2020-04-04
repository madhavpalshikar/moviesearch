const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
chai.use(chaiHttp);
chai.should();

describe("Movie Search", () => {
    describe("GET /", () => {
        it("should get search view", (done) => {
            chai.request(app)
                .get('/')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });

    describe("POST /search", () => {
        it('Search Service', function (done) {
            chai
                .request(app)
                .post('/search')
                .set('content-type', 'application/json')
                .send({ solrQuery: 'vote_average_f: [7 TO * ] AND (genre_ids_is:18 OR genre_ids_is:27)' })
                .end(function (error, res, body) {
                    if (error) {
                        done(error);
                    } else {
                        res.should.have.status(200);
                        done();
                    }
                });
        });
    });
});