import { Injectable } from '@nestjs/common';
import { ILgaSeed, ISeeder } from '../seeder.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lga } from 'src/entities/lga.entity';
import { State } from 'src/entities/state.entity';
import { seederRunner } from '../shared';

@Injectable()
export default class LgasSeed implements ISeeder {
  private lgasData: ILgaSeed[] = [
    {
      strippedName: 'abanorth',
      name: 'Aba North',
      code: 'LGA1',
      state: {
        strippedName: 'abia',
        name: 'Abia',
        code: 'NG-AB',
      },
    },
    {
      strippedName: 'abasouth',
      name: 'Aba South',
      code: 'LGA2',
      state: {
        strippedName: 'abia',
        name: 'Abia',
        code: 'NG-AB',
      },
    },
    {
      strippedName: 'arochukwu',
      name: 'Arochukwu',
      code: 'LGA3',
      state: {
        strippedName: 'abia',
        name: 'Abia',
        code: 'NG-AB',
      },
    },
    {
      strippedName: 'bende',
      name: 'Bende',
      code: 'LGA4',
      state: {
        strippedName: 'abia',
        name: 'Abia',
        code: 'NG-AB',
      },
    },
    {
      strippedName: 'ikwuano',
      name: 'Ikwuano',
      code: 'LGA5',
      state: {
        strippedName: 'abia',
        name: 'Abia',
        code: 'NG-AB',
      },
    },
    {
      strippedName: 'isialangwanorth',
      name: 'Isiala-Ngwa North',
      code: 'LGA6',
      state: {
        strippedName: 'abia',
        name: 'Abia',
        code: 'NG-AB',
      },
    },
    {
      strippedName: 'isialangwasouth',
      name: 'Isiala-Ngwa South',
      code: 'LGA7',
      state: {
        strippedName: 'abia',
        name: 'Abia',
        code: 'NG-AB',
      },
    },
    {
      strippedName: 'isuikwato',
      name: 'Isuikwato',
      code: 'LGA8',
      state: {
        strippedName: 'abia',
        name: 'Abia',
        code: 'NG-AB',
      },
    },
    {
      strippedName: 'obinwa',
      name: 'Obi Nwa',
      code: 'LGA9',
      state: {
        strippedName: 'abia',
        name: 'Abia',
        code: 'NG-AB',
      },
    },
    {
      strippedName: 'ohafia',
      name: 'Ohafia',
      code: 'LGA10',
      state: {
        strippedName: 'abia',
        name: 'Abia',
        code: 'NG-AB',
      },
    },
    {
      strippedName: 'osisioma',
      name: 'Osisioma',
      code: 'LGA11',
      state: {
        strippedName: 'abia',
        name: 'Abia',
        code: 'NG-AB',
      },
    },
    {
      strippedName: 'ngwa',
      name: 'Ngwa',
      code: 'LGA12',
      state: {
        strippedName: 'abia',
        name: 'Abia',
        code: 'NG-AB',
      },
    },
    {
      strippedName: 'ugwunagbo',
      name: 'Ugwunagbo',
      code: 'LGA13',
      state: {
        strippedName: 'abia',
        name: 'Abia',
        code: 'NG-AB',
      },
    },
    {
      strippedName: 'ukwaeast',
      name: 'Ukwa East',
      code: 'LGA14',
      state: {
        strippedName: 'abia',
        name: 'Abia',
        code: 'NG-AB',
      },
    },
    {
      strippedName: 'ukwawest',
      name: 'Ukwa West',
      code: 'LGA15',
      state: {
        strippedName: 'abia',
        name: 'Abia',
        code: 'NG-AB',
      },
    },
    {
      strippedName: 'umuahianorth',
      name: 'Umuahia North',
      code: 'LGA16',
      state: {
        strippedName: 'abia',
        name: 'Abia',
        code: 'NG-AB',
      },
    },
    {
      strippedName: 'umuahiasouth',
      name: 'Umuahia South',
      code: 'LGA17',
      state: {
        strippedName: 'abia',
        name: 'Abia',
        code: 'NG-AB',
      },
    },
    {
      strippedName: 'umuneochi',
      name: 'Umu-Neochi',
      code: 'LGA18',
      state: {
        strippedName: 'abia',
        name: 'Abia',
        code: 'NG-AB',
      },
    },
    {
      strippedName: 'demsa',
      name: 'Demsa',
      code: 'LGA19',
      state: {
        strippedName: 'adamawa',
        name: 'Adamawa',
        code: 'NG-AD',
      },
    },
    {
      strippedName: 'fufore',
      name: 'Fufore',
      code: 'LGA20',
      state: {
        strippedName: 'adamawa',
        name: 'Adamawa',
        code: 'NG-AD',
      },
    },
    {
      strippedName: 'ganaye',
      name: 'Ganaye',
      code: 'LGA21',
      state: {
        strippedName: 'adamawa',
        name: 'Adamawa',
        code: 'NG-AD',
      },
    },
    {
      strippedName: 'gireri',
      name: 'Gireri',
      code: 'LGA22',
      state: {
        strippedName: 'adamawa',
        name: 'Adamawa',
        code: 'NG-AD',
      },
    },
    {
      strippedName: 'gombi',
      name: 'Gombi',
      code: 'LGA23',
      state: {
        strippedName: 'adamawa',
        name: 'Adamawa',
        code: 'NG-AD',
      },
    },
    {
      strippedName: 'guyuk',
      name: 'Guyuk',
      code: 'LGA24',
      state: {
        strippedName: 'adamawa',
        name: 'Adamawa',
        code: 'NG-AD',
      },
    },
    {
      strippedName: 'hong',
      name: 'Hong',
      code: 'LGA25',
      state: {
        strippedName: 'adamawa',
        name: 'Adamawa',
        code: 'NG-AD',
      },
    },
    {
      strippedName: 'jada',
      name: 'Jada',
      code: 'LGA26',
      state: {
        strippedName: 'adamawa',
        name: 'Adamawa',
        code: 'NG-AD',
      },
    },
    {
      strippedName: 'lamurde',
      name: 'Lamurde',
      code: 'LGA27',
      state: {
        strippedName: 'adamawa',
        name: 'Adamawa',
        code: 'NG-AD',
      },
    },
    {
      strippedName: 'madagali',
      name: 'Madagali',
      code: 'LGA28',
      state: {
        strippedName: 'adamawa',
        name: 'Adamawa',
        code: 'NG-AD',
      },
    },
    {
      strippedName: 'maiha',
      name: 'Maiha',
      code: 'LGA29',
      state: {
        strippedName: 'adamawa',
        name: 'Adamawa',
        code: 'NG-AD',
      },
    },
    {
      strippedName: 'mayobelwa',
      name: 'Mayo-Belwa',
      code: 'LGA30',
      state: {
        strippedName: 'adamawa',
        name: 'Adamawa',
        code: 'NG-AD',
      },
    },
    {
      strippedName: 'michika',
      name: 'Michika',
      code: 'LGA31',
      state: {
        strippedName: 'adamawa',
        name: 'Adamawa',
        code: 'NG-AD',
      },
    },
    {
      strippedName: 'mubinorth',
      name: 'Mubi North',
      code: 'LGA32',
      state: {
        strippedName: 'adamawa',
        name: 'Adamawa',
        code: 'NG-AD',
      },
    },
    {
      strippedName: 'mubisouth',
      name: 'Mubi South',
      code: 'LGA33',
      state: {
        strippedName: 'adamawa',
        name: 'Adamawa',
        code: 'NG-AD',
      },
    },
    {
      strippedName: 'numan',
      name: 'Numan',
      code: 'LGA34',
      state: {
        strippedName: 'adamawa',
        name: 'Adamawa',
        code: 'NG-AD',
      },
    },
    {
      strippedName: 'shelleng',
      name: 'Shelleng',
      code: 'LGA35',
      state: {
        strippedName: 'adamawa',
        name: 'Adamawa',
        code: 'NG-AD',
      },
    },
    {
      strippedName: 'song',
      name: 'Song',
      code: 'LGA36',
      state: {
        strippedName: 'adamawa',
        name: 'Adamawa',
        code: 'NG-AD',
      },
    },
    {
      strippedName: 'toungo',
      name: 'Toungo',
      code: 'LGA37',
      state: {
        strippedName: 'adamawa',
        name: 'Adamawa',
        code: 'NG-AD',
      },
    },
    {
      strippedName: 'yolanorth',
      name: 'Yola North',
      code: 'LGA38',
      state: {
        strippedName: 'adamawa',
        name: 'Adamawa',
        code: 'NG-AD',
      },
    },
    {
      strippedName: 'yolasouth',
      name: 'Yola South',
      code: 'LGA39',
      state: {
        strippedName: 'adamawa',
        name: 'Adamawa',
        code: 'NG-AD',
      },
    },
    {
      strippedName: 'abak',
      name: 'Abak',
      code: 'LGA40',
      state: {
        strippedName: 'akwaibom',
        name: 'Akwa Ibom',
        code: 'NG-AK',
      },
    },
    {
      strippedName: 'easternobolo',
      name: 'Eastern Obolo',
      code: 'LGA41',
      state: {
        strippedName: 'akwaibom',
        name: 'Akwa Ibom',
        code: 'NG-AK',
      },
    },
    {
      strippedName: 'eket',
      name: 'Eket',
      code: 'LGA42',
      state: {
        strippedName: 'akwaibom',
        name: 'Akwa Ibom',
        code: 'NG-AK',
      },
    },
    {
      strippedName: 'esiteket',
      name: 'Esit Eket',
      code: 'LGA43',
      state: {
        strippedName: 'akwaibom',
        name: 'Akwa Ibom',
        code: 'NG-AK',
      },
    },
    {
      strippedName: 'essienudim',
      name: 'Essien Udim',
      code: 'LGA44',
      state: {
        strippedName: 'akwaibom',
        name: 'Akwa Ibom',
        code: 'NG-AK',
      },
    },
    {
      strippedName: 'etimekpo',
      name: 'Etim Ekpo',
      code: 'LGA45',
      state: {
        strippedName: 'akwaibom',
        name: 'Akwa Ibom',
        code: 'NG-AK',
      },
    },
    {
      strippedName: 'etinan',
      name: 'Etinan',
      code: 'LGA46',
      state: {
        strippedName: 'akwaibom',
        name: 'Akwa Ibom',
        code: 'NG-AK',
      },
    },
    {
      strippedName: 'ibeno',
      name: 'Ibeno',
      code: 'LGA47',
      state: {
        strippedName: 'akwaibom',
        name: 'Akwa Ibom',
        code: 'NG-AK',
      },
    },
    {
      strippedName: 'ibesikpoasutan',
      name: 'Ibesikpo Asutan',
      code: 'LGA48',
      state: {
        strippedName: 'akwaibom',
        name: 'Akwa Ibom',
        code: 'NG-AK',
      },
    },
    {
      strippedName: 'ibionoibom',
      name: 'Ibiono Ibom',
      code: 'LGA49',
      state: {
        strippedName: 'akwaibom',
        name: 'Akwa Ibom',
        code: 'NG-AK',
      },
    },
    {
      strippedName: 'ika',
      name: 'Ika',
      code: 'LGA50',
      state: {
        strippedName: 'akwaibom',
        name: 'Akwa Ibom',
        code: 'NG-AK',
      },
    },
    {
      strippedName: 'ikono',
      name: 'Ikono',
      code: 'LGA51',
      state: {
        strippedName: 'akwaibom',
        name: 'Akwa Ibom',
        code: 'NG-AK',
      },
    },
    {
      strippedName: 'ikotabasi',
      name: 'Ikot Abasi',
      code: 'LAG52',
      state: {
        strippedName: 'akwaibom',
        name: 'Akwa Ibom',
        code: 'NG-AK',
      },
    },
    {
      strippedName: 'ikotekpene',
      name: 'Ikot Ekpene',
      code: 'LGA53',
      state: {
        strippedName: 'akwaibom',
        name: 'Akwa Ibom',
        code: 'NG-AK',
      },
    },
    {
      strippedName: 'ini',
      name: 'Ini',
      code: 'LGA54',
      state: {
        strippedName: 'akwaibom',
        name: 'Akwa Ibom',
        code: 'NG-AK',
      },
    },
    {
      strippedName: 'itu',
      name: 'Itu',
      code: 'LGA55',
      state: {
        strippedName: 'akwaibom',
        name: 'Akwa Ibom',
        code: 'NG-AK',
      },
    },
    {
      strippedName: 'mbo',
      name: 'Mbo',
      code: 'LGA56',
      state: {
        strippedName: 'akwaibom',
        name: 'Akwa Ibom',
        code: 'NG-AK',
      },
    },
    {
      strippedName: 'mkpatenin',
      name: 'Mkpat Enin',
      code: 'LGA57',
      state: {
        strippedName: 'akwaibom',
        name: 'Akwa Ibom',
        code: 'NG-AK',
      },
    },
    {
      strippedName: 'nsitatai',
      name: 'Nsit Atai',
      code: 'LGA58',
      state: {
        strippedName: 'akwaibom',
        name: 'Akwa Ibom',
        code: 'NG-AK',
      },
    },
    {
      strippedName: 'nsitibom',
      name: 'Nsit Ibom',
      code: 'LGA59',
      state: {
        strippedName: 'akwaibom',
        name: 'Akwa Ibom',
        code: 'NG-AK',
      },
    },
    {
      strippedName: 'nsitubium',
      name: 'Nsit Ubium',
      code: 'LGA60',
      state: {
        strippedName: 'akwaibom',
        name: 'Akwa Ibom',
        code: 'NG-AK',
      },
    },
    {
      strippedName: 'obotakara',
      name: 'Obot Akara',
      code: 'LGA61',
      state: {
        strippedName: 'akwaibom',
        name: 'Akwa Ibom',
        code: 'NG-AK',
      },
    },
    {
      strippedName: 'okobo',
      name: 'Okobo',
      code: 'LGA62',
      state: {
        strippedName: 'akwaibom',
        name: 'Akwa Ibom',
        code: 'NG-AK',
      },
    },
    {
      strippedName: 'onna',
      name: 'Onna',
      code: 'LGA63',
      state: {
        strippedName: 'akwaibom',
        name: 'Akwa Ibom',
        code: 'NG-AK',
      },
    },
    {
      strippedName: 'oron',
      name: 'Oron',
      code: 'LGA64',
      state: {
        strippedName: 'akwaibom',
        name: 'Akwa Ibom',
        code: 'NG-AK',
      },
    },
    {
      strippedName: 'orukanam',
      name: 'Oruk Anam',
      code: 'LGA65',
      state: {
        strippedName: 'akwaibom',
        name: 'Akwa Ibom',
        code: 'NG-AK',
      },
    },
    {
      strippedName: 'udunguko',
      name: 'Udung Uko',
      code: 'LGA66',
      state: {
        strippedName: 'akwaibom',
        name: 'Akwa Ibom',
        code: 'NG-AK',
      },
    },
    {
      strippedName: 'ukanafun',
      name: 'Ukanafun',
      code: 'LGA67',
      state: {
        strippedName: 'akwaibom',
        name: 'Akwa Ibom',
        code: 'NG-AK',
      },
    },
    {
      strippedName: 'uruan',
      name: 'Uruan',
      code: 'LGA68',
      state: {
        strippedName: 'akwaibom',
        name: 'Akwa Ibom',
        code: 'NG-AK',
      },
    },
    {
      strippedName: 'urueoffongoruko',
      name: 'Urue-Offong/Oruko',
      code: 'LGA69',
      state: {
        strippedName: 'akwaibom',
        name: 'Akwa Ibom',
        code: 'NG-AK',
      },
    },
    {
      strippedName: 'uyo',
      name: 'Uyo',
      code: 'LGA70',
      state: {
        strippedName: 'akwaibom',
        name: 'Akwa Ibom',
        code: 'NG-AK',
      },
    },
    {
      strippedName: 'uyo',
      name: 'Uyo',
      code: 'LGA71',
      state: {
        strippedName: 'anambra',
        name: 'Anambra',
        code: 'NG-AN',
      },
    },
    {
      strippedName: 'uyo',
      name: 'Uyo',
      code: 'LGA72',
      state: {
        strippedName: 'bauchi',
        name: 'Bauchi',
        code: 'NG-BA',
      },
    },
    {
      strippedName: 'uyo',
      name: 'Uyo',
      code: 'LGA73',
      state: {
        strippedName: 'bayelsa',
        name: 'Bayelsa',
        code: 'NG-BA',
      },
    },
    {
      strippedName: 'uyo',
      name: 'Uyo',
      code: 'LGA74',
      state: {
        strippedName: 'benue',
        name: 'Benue',
        code: 'NG-BE',
      },
    },
    {
      strippedName: 'uyo',
      name: 'Uyo',
      code: 'LGA71',
      state: {
        strippedName: 'borno',
        name: 'Borno',
        code: 'NG-BO',
      },
    },
    {
      strippedName: 'uyo',
      name: 'Uyo',
      code: 'LGA71',
      state: {
        strippedName: 'crossriver',
        name: 'Cross River',
        code: 'NG-CR',
      },
    },
    {
      strippedName: 'uyo',
      name: 'Uyo',
      code: 'LGA71',
      state: {
        strippedName: 'delta',
        name: 'Delta',
        code: 'NG-DE',
      },
    },
    {
      strippedName: 'uyo',
      name: 'Uyo',
      code: 'LGA71',
      state: {
        strippedName: 'ebonyi',
        name: 'Ebonyi',
        code: 'NG-EB',
      },
    },
    {
      strippedName: 'uyo',
      name: 'Uyo',
      code: 'LGA71',
      state: {
        strippedName: 'edo',
        name: 'Edo',
        code: 'NG-ED',
      },
    },
    {
      strippedName: 'uyo',
      name: 'Uyo',
      code: 'LGA71',
      state: {
        strippedName: 'ekiti',
        name: 'Ekiti',
        code: 'NG-EK',
      },
    },
    {
      strippedName: 'uyo',
      name: 'Uyo',
      code: 'LGA71',
      state: {
        strippedName: 'enugu',
        name: 'Enugu',
        code: 'NG-EN',
      },
    },
    {
      strippedName: 'uyo',
      name: 'Uyo',
      code: 'LGA71',
      state: {
        strippedName: 'fct',
        name: 'FCT',
        code: 'NG-FC',
      },
    },
    {
      strippedName: 'uyo',
      name: 'Uyo',
      code: 'LGA71',
      state: {
        strippedName: 'gombe',
        name: 'Gombe',
        code: 'NG-GO',
      },
    },
    {
      strippedName: 'uyo',
      name: 'Uyo',
      code: 'LGA71',
      state: {
        strippedName: 'imo',
        name: 'Imo',
        code: 'NG-IM',
      },
    },
    {
      strippedName: 'uyo',
      name: 'Uyo',
      code: 'LGA71',
      state: {
        strippedName: 'jigawa',
        name: 'Jigawa',
        code: 'NG-JI',
      },
    },
    {
      strippedName: 'uyo',
      name: 'Uyo',
      code: 'LGA71',
      state: {
        strippedName: 'kaduna',
        name: 'Kaduna',
        code: 'NG-KD',
      },
    },
    {
      strippedName: 'uyo',
      name: 'Uyo',
      code: 'LGA71',
      state: {
        strippedName: 'kano',
        name: 'Kano',
        code: 'NG-KN',
      },
    },
    {
      strippedName: 'uyo',
      name: 'Uyo',
      code: 'LGA71',
      state: {
        strippedName: 'katsina',
        name: 'Katsina',
        code: 'NG-KA',
      },
    },
    {
      strippedName: 'uyo',
      name: 'Uyo',
      code: 'LGA71',
      state: {
        strippedName: 'kebbi',
        name: 'Kebbi',
        code: 'NG-KE',
      },
    },
    {
      strippedName: 'uyo',
      name: 'Uyo',
      code: 'LGA71',
      state: {
        strippedName: 'kogi',
        name: 'Kogi',
        code: 'NG-KO',
      },
    },
    {
      strippedName: 'uyo',
      name: 'Uyo',
      code: 'LGA71',
      state: {
        strippedName: 'kwara',
        name: 'Kwara',
        code: 'NG-KW',
      },
    },
    {
      strippedName: 'uyo',
      name: 'Uyo',
      code: 'LGA71',
      state: {
        strippedName: 'lagos',
        name: 'Lagos',
        code: 'NG-LA',
      },
    },
    {
      strippedName: 'uyo',
      name: 'Uyo',
      code: 'LGA71',
      state: {
        strippedName: 'nasarawa',
        name: 'Nasarawa',
        code: 'NG-NA',
      },
    },
    {
      strippedName: 'uyo',
      name: 'Uyo',
      code: 'LGA71',
      state: {
        strippedName: 'niger',
        name: 'Niger',
        code: 'NG-NI',
      },
    },
    {
      strippedName: 'uyo',
      name: 'Uyo',
      code: 'LGA71',
      state: {
        strippedName: 'ogun',
        name: 'Ogun',
        code: 'NG-OG',
      },
    },
    {
      strippedName: 'uyo',
      name: 'Uyo',
      code: 'LGA71',
      state: {
        strippedName: 'ondo',
        name: 'Ondo',
        code: 'NG-on',
      },
    },
    {
      strippedName: 'uyo',
      name: 'Uyo',
      code: 'LGA71',
      state: {
        strippedName: 'osun',
        name: 'Osun',
        code: 'NG-OS',
      },
    },
    {
      strippedName: 'uyo',
      name: 'Uyo',
      code: 'LGA71',
      state: {
        strippedName: 'oyo',
        name: 'Oyo',
        code: 'NG-OY',
      },
    },
    {
      strippedName: 'uyo',
      name: 'Uyo',
      code: 'LGA71',
      state: {
        strippedName: 'plateau',
        name: 'Plateau',
        code: 'NG-PL',
      },
    },
    {
      strippedName: 'uyo',
      name: 'Uyo',
      code: 'LGA71',
      state: {
        strippedName: 'rivers',
        name: 'Rivers',
        code: 'NG-RI',
      },
    },
    {
      strippedName: 'uyo',
      name: 'Uyo',
      code: 'LGA71',
      state: {
        strippedName: 'sokoto',
        name: 'Sokoto',
        code: 'NG-AN',
      },
    },
    {
      strippedName: 'uyo',
      name: 'Uyo',
      code: 'LGA71',
      state: {
        strippedName: 'taraba',
        name: 'Taraba',
        code: 'NG-TA',
      },
    },
    {
      strippedName: 'uyo',
      name: 'Uyo',
      code: 'LGA71',
      state: {
        strippedName: 'yobe',
        name: 'Yobe',
        code: 'NG-YO',
      },
    },
    {
      strippedName: 'uyo',
      name: 'Uyo',
      code: 'LGA71',
      state: {
        strippedName: 'zamfara',
        name: 'Zamfara',
        code: 'NG-ZA',
      },
    },
  ];

  constructor(
    @InjectRepository(State) private statesRepo: Repository<State>,
    @InjectRepository(Lga) private lgaRepo: Repository<Lga>,
  ) {}

  async run(): Promise<boolean> {
    return seederRunner({
      lgaData: this.lgasData,
      statesRepo: this.statesRepo,
      lgaRepo: this.lgaRepo,
    });
  }
}
