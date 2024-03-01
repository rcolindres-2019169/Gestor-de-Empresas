'use strict'

import Category from './category.model.js'
import { checkUpdate } from '../utils/validator.js'

export const save = async(req, res)=>{  
    try{
        let data = req.body
        const existingCategory = await Category.findOne({ name: data.name });
        if (existingCategory) {
            return res.status(400).send({ message: 'Category with the same name already exists' });
        }
        let category = new Category(data)
        await category.save()
        return res.send({message: `Registered successfully,  ${category.name}`})
        
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error registering category', err: err})
    }

}

export const update = async (req,res) =>{
    try{
        let { id } = req.params
        let data = req.body
        let update = checkUpdate(data, id)
        if(!update) return res.status(400).send({message: 'Have submitted some data that cannot be updated or missing data'})
        let updatedCategory = await Category.findOneAndUpdate(
            {_id: id},
            data, 
            {new: true}
        )
        if(!updatedCategory) return res.status(401).send({message: 'Category not found and not updated'})
        return res.send({message: 'Updated category', updatedCategory})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error updating category'})
    }
}

export const deleteU = async (req,res)=>{
    try{
        let { id } = req.params
        let deletedCategory = await Category.findOneAndDelete({_id: id})
        if(!deletedCategory) return res.status(404).send({message: 'Category not found and not deleted'})
        return res.send({message: `Category with name ${deletedCategory.name} deleted successfully`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error deleting account'})
    }
}

export const get = async (req,res ) =>{
    try{
        let categories = await Category.find()
        return res.send({categories})
    }catch(err){
        console.error(err)
        return res.status(500).send({ message: 'Error getting categories' })
    }
}


export const search = async(req,res)=>{
    try{
        let { search } = req.body
        let categories = await Category.find(
            {name: { $regex: new RegExp(search, 'i') } }
        )
        if (categories.length === 0) {
            return res.status(404).send({ message: 'Categories not found' });
        }
        if(!categories) return res.status(404).send({message: 'Categories not found'})
            return res.send({message: 'Categories found', categories})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error searching categories'})
    }
}