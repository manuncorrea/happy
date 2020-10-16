import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import orphanagesView from '../views/orphanages_view';
import * as Yup from 'yup';

import Orphanages from '../models/Orphanages';

export default {
    //listar orphanato 
    async index(request: Request, response: Response) {
        const orphanagesRepositoy = getRepository(Orphanages);

        const orphanages = await orphanagesRepositoy.find({
            relations: ['images']
        });

        return response.json(orphanagesView.renderMany(orphanages));
    },

    //listar um unico orphanato 
    async show(request: Request, response: Response) {
        const { id } = request.params;

        const orphanagesRepositoy = getRepository(Orphanages);

        const orphanage = await orphanagesRepositoy.findOneOrFail(id, {
            relations: ['images']
        });

        return response.json(orphanagesView.render(orphanage));
    },

    //criar orphanato
    async create(request: Request, response: Response) {
        const{
            name,
            latitude,
            longitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends,
        } = request.body;
    
        const orphanagesRepositoy = getRepository(Orphanages);

        const requestImages = request.files as Express.Multer.File[];
        const images = requestImages.map(image => {
            return { path: image.filename }
        });

        const data = {
            name,
            latitude,
            longitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends,
            images
        };

        const schema = Yup.object().shape({
            name: Yup.string().required(),
            latitude: Yup.number().required(),
            longitude: Yup.number().required(),
            about: Yup.string().required().max(300),
            instructions: Yup.string().required(),
            opening_hours: Yup.string().required(),
            open_on_weekends: Yup.boolean().required(),
            images: Yup.array(
                Yup.object().shape({
                    path: Yup.string().required()
                })
            )
        });

        await schema.validate(data, {
            abortEarly: false,
        });
    
        const orphanages = orphanagesRepositoy.create(data);
    
        //salvar no bd
       await orphanagesRepositoy.save(orphanages);
    
        return response.status(201).json(orphanages);
    }
    
}