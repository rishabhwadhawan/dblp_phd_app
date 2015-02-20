import sys
import requests
from lxml import html
import re

url = sys.argv[1]
date = sys.argv[2]
journal_string = sys.argv[3]

page = requests.get(url)
tree = html.fromstring(page.text)

text = tree.xpath("//div[@id = 'article-authors']/div[@class = 'authors']/text()")
texta = re.sub('[0-9]','', str(text))
textb = re.sub('[\\\]','-', str(texta))
textb = re.sub('-t','', str(textb))
textb = re.sub('-n','', str(textb))
textb = re.sub('-r','', str(textb))
print (textb)




