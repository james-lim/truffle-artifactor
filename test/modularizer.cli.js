const chai = require('chai')
const truffleConfig = require('../sample-truffle/truffle-config')
chai.use(require('chai-bignumber')()).should()

const modularizedTruffleProject = require('../sample-truffle/src/custom/index')

describe('Test for cli argument', () => {
  context('should ignore properties in truffle-config.js when cli options exist', () => {
    it('should have wrong output value', () => {
      truffleConfig.modularizer.output.should.equal('src/wrong/index.js')
    })
    it('should have wrong target value', () => {
      truffleConfig.modularizer.target.should.equal('build/wrong/contracts')
    })
    it('should have wrong includeOnly value', () => {
      truffleConfig.modularizer
        .should.have.property('includeOnly')
        .with.lengthOf(1)
      truffleConfig.modularizer.includeOnly[0].should.equal('Wrong')
    })
  })
  describe('src/custom/index.js', () => {
    it('Should not include Migrations function in the module', () => {
      modularizedTruffleProject.should.not.have.property('Migrations')
    })
    it('Should include SampleContract function in the module', () => {
      modularizedTruffleProject.should.have.property('SampleContract')
    })
  })
})
