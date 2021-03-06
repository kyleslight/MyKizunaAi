#!/usr/bin/env node
/**
 *   MyKizunaAi - https://github.com/zzmzz/MyKizunaAi
 *
 *   Based on Wechaty
 *
 *   just for fun
 */
/**
 *   Wechaty - https://github.com/chatie/wechaty
 *
 *   Copyright 2016-2017 Huan LI <zixia@zixia.net>
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */

const qrcodeTerminal = require('qrcode-terminal')
const schedule = require('node-schedule');


import {
    config,
    Room,
    Wechaty,
    log,
} from '../'

const bot = Wechaty.instance({profile: config.DEFAULT_PROFILE})

bot
    .on('login', function (this, user) {
        log.info('Bot', `${user.name()} logined`)
        this.say('wechaty contact-bot just logined')

        schedule.scheduleJob('0 0 14 * * 1', remind.bind(this));
        schedule.scheduleJob('0 */5 * * * *', checkAlive.bind(this));
    })
    .on('logout', user => log.info('Bot', `${user.name()} logouted`))
    .on('error', e => log.info('Bot', 'error: %s', e))
    .on('scan', (url, code) => {
        if (!/201|200/.test(String(code))) {
            const loginUrl = url.replace(/\/qrcode\//, '/l/')
            qrcodeTerminal.generate(loginUrl)
        }
        console.log(`${url}\n[${code}] Scan QR Code in above url to login: `)
    })

bot.init()
    .catch(e => {
        log.error('Bot', 'init() fail: %s', e)
        bot.quit()
        process.exit(-1)
    })

async function remind() {
    log.info("test success")
    var rooms = new Array("吃块虾片压压惊", "瓴岳科技")
    for(var index in rooms) {
        log.info(rooms[index])
        const room = await Room.find({topic: rooms[index]})
        if (room) {
            /**
             * room found
             */
            log.info('Bot', 'onMessage: got room: %s', room.topic())
            room.say('新的一周大家不要忘记订餐哦（大概下午2点发')
        }
    }
}

async function checkAlive() {
    this.say('爱酱 still alive')
}