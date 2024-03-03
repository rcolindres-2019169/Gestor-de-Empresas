'use strict'

import Company from './company.model.js'
import Category from '../category/category.model.js'
import { checkUpdate } from '../utils/validator.js'
import excel from 'exceljs';

export const save = async(req,res) =>{
    try{
        let data = req.body
        const existingCategory = await Category.findById( data.category );
        if (!existingCategory) {
            return res.status(400).send({ message: 'The category does not exist' });
        }

        const existingCompany = await Company.findOne({name: data.name})
        if(existingCompany){
            return res.status(400).send({ message: 'Company with the same name already exists' });
        }
        let company = new Company(data)
        await company.save()    
        return res.send({message: `Registered succesfully  ${company.name}`})

    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error registering company', err: err})
    }
}

export const update = async (req,res) =>{
    try{
        let {id} = req.params
        let data = req.body
        let update = checkUpdate(data, id)
        const existingCategory = await Category.findById( data.category );
        if (!existingCategory) {
            return res.status(400).send({ message: 'The category does not exist' });
        }

        const existingCompany = await Company.findOne({name: data.name})
        if(existingCompany){
            return res.status(400).send({ message: 'Company with the same name already exists' });
        }
        if(!update) return res.status(400).send({message: 'Have submitted some data that cannot be updated or missing data'})
        let updatedCompany = await Company.findOneAndUpdate(
            {_id: id},
            data, 
            {new: true}
        ).populate('category',['name'])
        if(!updatedCompany) return res.status(401).send({message: 'Company not found and not updated'})
        return res.send({message: 'Updated company', updatedCompany})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error updating company'})
    }
}


export const get = async (req,res)=>{
    try{
        let companies = await Company.find().populate('category', ['name'])
        return res.send({companies})
    }catch(err){
        console.error(err)
        return res.status(500).send({ message: 'Error getting companies' })
    }
}



export const getZ = async (req,res)=>{
    try {
        let { descender } = req.query;
        let order = -1; 

        if (descender === 'desc') {
            order = -1; 
        }

        let companies = await Company.find().sort({ name: order }).populate('category', ['name']);
        return res.send({ companies });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error getting companies' });
    }
}

export const getA = async (req,res)=>{
    try {
        let { asscender } = req.query;
        let order = 1; 

        if (asscender === 'asc') {
            order = 1; 
        }

        let companies = await Company.find().sort({ name: order }).populate('category', ['name']);;
        return res.send({ companies });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error getting companies' });
    }
}

export const search = async (req,res)=>{
    try{
        let { name, years, category } = req.body
        let companies = await Company.find({
        $or:[
           { name: name },
           { years: years},
           { category: category }
        ]
        }).populate('category', ['name']);
        if (companies.length === 0) {
            return res.status(404).send({ message: 'Companies not found' });
        }
        if(!companies) return res.status(404).send({message: 'Companies not found'})
            return res.send({message: 'Companies found', companies})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error searching companies'})
    }
}



export const excelGen = async (req, res) => {
    try {
        let companies = await Company.find({}, { name: 1, years: 1, impactLevel: 1, category: 1 });

        let book = new excel.Workbook();
        let worksheet = book.addWorksheet('Companies');

        worksheet.columns = [
            { header: 'Company Name', key: 'name', width: 40 },
            { header: 'Years', key: 'years', width: 15 },
            { header: 'ImpactLevel', key: 'impactLevel', width: 20 },
            { header: 'Category', key: 'category', width: 30 }
        ];

        companies.forEach(company => {
            worksheet.addRow({
                name: company.name,
                years: company.years,
                impactLevel: company.impactLevel,
                category: company.category
            });
        });

        const filePath = './companies.xlsx'; 
        await book.xlsx.writeFile(filePath);
        
        res.download(filePath, 'companies.xlsx')
        return res.send({message: 'Download succesfully'})

    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error generating Excel' });
    }
}
