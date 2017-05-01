/* Initialize the About and Contact pages in the db */

const mongoose = require('mongoose')
const models = require('../models')
const config = require('../../../config')
const _ = require('lodash')

mongoose.connect('mongodb://localhost/' + config.db)

const routes = ['About', 'Contact'];
let completed = 0;

routes.map((route) => {
  const page = {
    route: route,
    text: 'Lorem ipsum dolor sit amet, venenatis sodales placerat, in voluptates hac, dui a sed nullam purus. Tincidunt sed ultrices, integer ante sed aliquam placerat, fringilla lectus ante nibh. Amet magnis, et gravida lacinia nec non. Vestibulum non nunc, ligula fusce. Interdum varius sed, praesent per amet, tristique vitae lobortis dui facilisis, vestibulum sit. Tempus eget quas, parturient gravida magna sem montes turpis. Donec nec, vitae vel nec commodo, cursus pellentesque purus et, id faucibus tempus. Integer sem, vehicula nunc in consequat magni, at fermentum aenean donec. Commodo gravida sodales ante velit iaculis, wisi elit lacus, amet tellus libero id suscipit fusce, nibh cursus in, dui dui sociis viverra vestibulum. Pretium quis amet vestibulum lacus cras vel, sapien ligula magna. Lorem tempor litora suspendisse, nibh ultricies, sollicitudin sit nunc orci at porta massa.\n\nEtiam dolor elit, amet sit ac ultricies et erat maecenas, massa suspendisse in venenatis quisque tellus, curabitur venenatis id est odio iaculis. Rhoncus mauris ultricies habitasse sed, eros dui mattis aenean blandit mi adipiscing, fermentum purus vitae in nisl varius auctor, ad vitae elit donec non. Sit tortor morbi suspendisse non nulla sit, eu qui taciti. Donec integer risus lectus, congue orci tincidunt id nullam. Arcu rhoncus aliquam nunc, ac ut ac iaculis, scelerisque erat sodales risus et donec wisi, nam consectetuer duis fermentum purus commodo tincidunt. Non rhoncus torquent, leo convallis fusce sed dui, vehicula id tortor donec ligula vitae amet, sit parturient rutrum, ligula ipsum ac morbi laoreet libero. Metus purus non at ultricies quam, pede proin morbi vehicula lobortis, tellus rutrum, et tristique risus odio mauris, sed lectus in blandit. Pede tincidunt vivamus montes purus, sit velit lacinia suscipit sed cras hendrerit, semper natus, placerat elit donec aliquet dui.\n\nOrci nulla. Odio justo placerat sit neque fringilla, convallis parturient, magna placerat dis fusce quo leo, et dictum nulla dignissim. Enim scelerisque ligula arcu dolor, euismod rhoncus conubia, dui sodales ac sed, nam sagittis adipiscing vivamus. Lorem blandit vitae pretium. Sem a, justo turpis mauris facilisis suscipit, ligula in amet pede at viverra per, leo a felis scelerisque posuere a. Amet leo imperdiet, at quis vel. Curabitur quis turpis pellentesque etiam praesent nostrum, donec neque consectetuer commodo elit scelerisque, lorem quis vitae, vitae proin commodo nulla sed, pellentesque integer non eget. Erat arcu maecenas hac, lacus proin lectus aperiam odio lacus sed, sodales vestibulum, arcu pellentesque. Dictum et amet vivamus nec, augue id metus donec elit fermentum vestibulum, mauris neque mattis diam. Lacus praesent mi nullam ut. Leo convallis pellentesque ante nascetur, sed nec sit, metus elit tortor suspendisse faucibus dictum arcu, eu elit enim enim et ipsum sollicitudin. Elit neque, wisi porttitor tempus magnis lacus curabitur ligula, molestie potenti tincidunt quisque tempus elit, risus wisi amet a aliquet id.'
  };

  const simplePage = new models.simplepage(page);
  simplePage.save((err, result) => {
    if (err) console.log(err)
    completed++;
    if (completed == routes.length) {
      console.log(' * initialized simplepages')
      process.exit()
    }
  })
})
