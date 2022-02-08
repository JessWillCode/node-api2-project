const router = require('express').Router()

const Post = require('./posts-model');

// //POSTS ENDPOINTS
router.get('/', (req,res) => {
    Post.find()
    .then(posts => {
        res.status(200).json(posts);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            message: 'The posts information could not be retrieved'
        })
    })
})

router.get('/:id', (req,res) => {
    Post.findById(req.params.id)
    .then(post => {
        if (!post) {
            res.status(404).json({
            message: 'The post with the specified ID does not exist'
        })
        } else {
            res.status(200).json(post);
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            message: 'The post information could not be retrieved'
        })
    })
})

router.post('/', (req, res) => {
    const { title, contents } = req.body
    if(!title || !contents) {
        res.status(400).json({
            message: 'Please provide title and contents for the post'
        })
    } else {
        Post.insert({ title, contents })
        .then(({ id }) => {
            return Post.findById(id)
        })
        .then(post => {
            res.status(201).json(post)
        }) 
        .catch(err => {
            res.status(500).json({
                message: 'There was an error while saving the post to the database'
            })
        })
    }
})

router.put('/:id', (req,res) => {
   if(!req.params.id) {
    res.status(404).json({
        message: 'The post with the specified ID does not exist'
    })
} else {
    if(!req.body.title || !req.body.contents) {
    res.status(400).json({
        message: 'Please provide title and contents for the post'
        })
    } else {
    Post.update(req.params.id, req.body)
        .then(post => {
            res.status(201).json(post)
        })
        .catch(err => {
        res.status(500).json({
            message: 'The post information could not be modified'
        })
    })
    }
}
})

router.delete('/:id', async (req,res) => {
    try {
        const postToDelete = await Post.findById(req.params.id)
        if(!postToDelete) {
            res.status(404).json({
                message: 'The post with the specified ID does not exist'
            })
        } else {
            await Post.remove(req.params.id)
            res.json(postToDelete)
        }
    } catch (err) {
        res.status(500).json({
            message: 'The post could not be removed'
        })
    }
})



// router.get('/:id/comments', (req,res) => {
//     Post.findPostComments()
//     .then(post => {
//         if(!post) {
//             res.status(404).json({
//                 message: 'The post with the specified ID does not exist'
//             })
//         } else {
//             res.status(200).json(post.comments)
//         }
//     })
//     .catch(err => {
//         res.staus(500).json({
//             message: 'The comments information could not be retrieved'
//         })
//     })
// })

module.exports = router;