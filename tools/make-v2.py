# Пересобирает вариант v2 («Графит и серебро») из index.html, price.html и assets/css/style.css.
# Запуск из корня репозитория: python3 tools/make-v2.py
import re,os
c=open('assets/css/style.css',encoding='utf-8').read()
m={'#050f22':'#0b0c0e','#0a1b38':'#15171a','#0e2347':'#1c1f23','#132d59':'#25292e','#1d4380':'#3b4149','#3d6fb8':'#7b848f',
'#9db8e0':'#a9b0b8','#c9d8ef':'#cfd4d9','#eef5ff':'#ffffff','#f2f4f7':'#f1f2f3','#e8ecf1':'#e6e8ea','#d3d9e1':'#d6d9dc',
'#b9c2ce':'#bcc1c6','#677487':'#6c7279','#4e5a6b':'#51575e','#0d1626':'#111214',
'rgb(10 27 56':'rgb(21 23 26','rgb(5 15 34':'rgb(11 12 14','rgb(61 111 184':'rgb(123 132 143','rgb(201 216 239':'rgb(207 212 217',
'rgb(157 190 255':'rgb(220 228 238','rgb(29 67 128':'rgb(59 65 73','--light-glow: 157 190 255':'--light-glow: 220 228 238'}
for a,b in m.items(): c=c.replace(a,b).replace(a.upper(),b)
head='/* VAGMOTORS — вариант «Графит и серебро». Собран из style.css заменой палитры: графит вместо синего, серебро и белый свет, красный только в логотипе и главных кнопках. */\n'
open('assets/css/style-v2.css','w',encoding='utf-8').write(head+c)
os.makedirs('v2',exist_ok=True)
for f in ['index.html','price.html']:
  h=open(f,encoding='utf-8').read()
  h=h.replace('href="assets/css/style.css"','href="../assets/css/style-v2.css"')
  h=h.replace('"assets/','"../assets/').replace(' assets/img/',' ../assets/img/')
  h=h.replace('href="favicon.png"','href="../favicon.png"').replace('href="apple-touch-icon.png"','href="../apple-touch-icon.png"')
  h=h.replace('content="#0a1b38"','content="#15171a"')
  h=h.replace('https://dirol982.github.io/vagmotors/','https://dirol982.github.io/vagmotors/v2/')
  open('v2/'+f,'w',encoding='utf-8').write(h)
print('v2 ok')
