require 'ftools'

module Jekyll
  class TagFileGenerator < Generator
    safe true
    priority :low

    def generate(site)
      tags = site.posts.map{ |p| p.tags }.flatten.uniq.sort
      templ = tag_template site
      tags.each do |tag|
        page = Jekyll::Page.new site, site.source, File.dirname(templ), File.basename(templ)
        assign_tag_to_page tag, page
        site.pages << page
      end
      ensure_tags_dir_exists site
    end

    private

    def tag_template(site)
      site.config['tag_template'] || '_tag.html'
    end

    def assign_tag_to_page(tag, page)
      page.instance_eval do
        @basename = tag
        @output_ext = '.html'
        self.data['permalink'] = "/tags/#{tag}.html"
        self.data['tag'] = tag
        self.data['title'].gsub! '{{tag}}', tag
      end
    end

    def ensure_tags_dir_exists(site)
      FileUtils.mkdir_p(File.join(site.dest, 'tags'))
    end

  end
end