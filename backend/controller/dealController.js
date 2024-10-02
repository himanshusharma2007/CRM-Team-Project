const deal = require("../models/dealModels")
const user = require("../models/userModels")


exports.createDeal = async (req, res) => {
  const { dealName, companyName, contactName, amount, description, stage, leaderId} = req.body;

  try {
    if(!dealName || !companyName || !contactName || !amount || !description || !stage || !leaderId){
      return res.status(400).send({
        success:false,
        message: "please fill all fields"
      })
    }
    const leader = await user.findById(leaderId)
    if(!leader){
    	return res.status(400).send({
    		success: false,
    		message: "leader not found"
    	})
    }
    const dealdata = await deal.create({
      dealName,
      companyName,
      amount,
      description,
      stage,
      leaderId: leader._id,
    });
    res.status(201).send({
      success: true,
      message: "deal created",
      data: dealdata
    });
  } catch (err) {
    console.log(err)
    res.status(500).send({
      success: false,
      message: "Internel server error"
    });
  }
};


//  update/:id
exports.updateTodo = async (req,res) =>{

  const { title, description, priority } = req.body;
    try {
        if(!title && !description && !priority &&!status){
          return res.status(400).send({
            success: false,
            message: "please fill any fields for update"
          })
        }
        const tododata = await todo.findById(req.params.id);
        if (!tododata) return res.status(404).send({success:false, message: 'Task not found' });

        console.log(tododata.userId, req.user._id)
        if(!tododata.userId.equals(req.user._id)){
          return res.status(401).send({
            success:false,
            message: "you can not change other user todo"
          })
        }

        // Update task fields
        tododata.title = title || tododata.title;
        tododata.description = description || tododata.description;
        tododata.priority = priority || tododata.priority;
        tododata.status = status || tododata.status;

        await tododata.save();
        return res.status(200).send({
          success: true,
          message: "todo updated",
          data: tododata
        });
    } catch (err) {
        console.log(err)
        res.status(500).send({
        success: false,
        message: "Internel server error"
      });
    }
}


exports.getTodo = async(req, res)=>{
  try{
    const tododata = await todo.find({userId: req.user.id });
    return res.status(200).send({
      success: true,
      message: "all todo data",
      data: tododata
    })
  } catch (err) {
        console.log(err)
        res.status(500).send({
        success: false,
        message: "Internel server error"
      });
    }
}


exports.getSingleTodo = async (req, res)=>{
  try{
    const tododata = await todo.findById(req.params.id);
    if(!tododata.userId.equals(req.user._id)){
      return res.status(401).send({
        success: false,
        message: "not access other user data"
      })
    }
    return res.status(200).send({
      success: true,
      message: "todo data",
      data: tododata
    })
  } catch (err) {
        console.log(err)
        res.status(500).send({
        success: false,
        message: "Internel server error"
      });
    }
}