class Dog
	@@howmanydogs=0
	def initialize(name)
		@name=name
		@@howmanydogs+=1
	end
end

p $0
p $.
p $*
p $$
p $?